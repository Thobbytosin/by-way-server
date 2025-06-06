import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import Order, { IOrder } from "../models/order.model";
import User from "../models/user.model";
import Course from "../models/course.model";
import { getAllOrdersService, newOrder } from "../services/order.services";
import sendMail from "../utils/sendMail";
import Notification from "../models/notification.model";
// import { redis } from "../utils/redis";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("Stripe secret key is required");
// }

// stripe docs
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create order
export const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { payment_info, courseId } = req.body as IOrder;

    if (payment_info) {
      if ("id" in payment_info) {
        const paymentIntentId: any = payment_info.id;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );

        if (paymentIntent.status !== "succeeded") {
          return next(new ErrorHandler("Payment failed", 400));
        }
      }
    }

    const user = await User.findById(req.user?._id);

    if (!user) return next(new ErrorHandler("User not found", 404));

    const userAlreadyHasCourse = user.courses.find(
      (course: any) => course.courseId === courseId
    );

    if (userAlreadyHasCourse)
      return next(
        new ErrorHandler("You have already purchased this course", 400)
      );

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const data: any = {
      courseId: course._id,
      userId: user._id,
    };

    //   order created
    const order = await Order.create(data);

    if (!order)
      return next(
        new ErrorHandler(
          "Encountered error processing order. Please try again",
          422
        )
      );

    //   send email notification to user
    const mailData = {
      order: {
        _id: order._id,
        courseName: course.name,
        user: user.name,
        price: course.price.toLocaleString(),
        date: new Date().toLocaleDateString("en-Ud", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    try {
      await sendMail({
        email: user.email,
        subject: "Order Confirmation",
        template: "order-confirmation.ejs",
        data: mailData,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }

    // //
    // user.courses.push({ courseId });

    // await user.save();

    // 2. Initialize the progress array with videoId and viewed: false
    const progress = course.courseData.map((video) => ({
      videoId: video._id,
      viewed: false,
    }));

    // this will push the course into the courses array as well as the progress for each videos
    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          courses: {
            courseId: courseId,
            progress: progress,
            reviewed: false,
          },
        },
      }
    );

    //   create notification
    await Notification.create({
      userId: user._id,
      title: "New Order",
      message: `You have a new order from ${course.name}`,
    });

    course.purchase += 1;

    await course.save();

    // update course redis

    // await redis.set(`course - ${courseId}`, JSON.stringify(course));

    // and update all courses
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    if (!courses) return next(new ErrorHandler("Course not found", 404));

    // update all courses redis
    // await redis.set("allCourses", JSON.stringify(courses));

    res.apiSuccess(order, "You have successfully purchased this course!", 201);
  }
);

// get all orders - admin only

export const getAllOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.name, 400));
    }
  }
);

// send stripe publishable key
export const sendStripePublishableKey = catchAsyncError(
  (req: Request, res: Response) => {
    res.apiSuccess(
      { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY },
      "Key sent"
    );
  }
);

// create new payment
export const newPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    const myPayment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "NGN",
      metadata: {
        company: "ByWay E-Learning Management System",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.apiSuccess({ re_cur: myPayment.client_secret }, "Payment Successful");
  }
);
