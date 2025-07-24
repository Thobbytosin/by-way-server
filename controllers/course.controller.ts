import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import cloudUploader, { cloudApi } from "../utils/cloudinary";
import User from "../models/user.model";
import {
  createCourse,
  getAllCoursesService,
} from "../services/course.services";
import Course from "../models/course.model";
import { isValidObjectId } from "mongoose";
import sendMail from "../utils/sendMail";
import Notification from "../models/notification.model";
import axios from "axios";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// upload course

export const uploadCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const { demoVideo, thumbnail } = req.files;

    // ensure price is a number
    data.price = +data.price;
    data.estimatedPrice = +data.estimatedPrice;

    //for the arrays
    const parsedBenefits = JSON.parse(data.benefits);
    const parsedPrerequisites = JSON.parse(data.prerequisites);
    const parsedCourseData = JSON.parse(data.courseData);

    data.prerequisites = parsedPrerequisites;
    data.benefits = parsedBenefits;
    data.courseData = parsedCourseData;

    if (!demoVideo)
      return next(new ErrorHandler("Upload Course Intro Video", 400));

    if (!data) return next(new ErrorHandler("Fields are missing", 400));

    // check if course exist
    const isCourseExist = await Course.findOne({ name: data.name });

    if (isCourseExist)
      return next(new ErrorHandler("Course already exists", 422));

    // for image upload

    if (!thumbnail) return next(new ErrorHandler("Upload Course Banner", 400));

    if (Array.isArray(thumbnail))
      return next(new ErrorHandler("Multiple images not allowed", 422));

    if (!thumbnail.mimetype?.startsWith("image"))
      return next(
        new ErrorHandler(
          "Invalid image format. File must be an image(.jpg, .png, .jpeg)",
          422
        )
      );

    if (thumbnail) {
      const folderPath = `byWay/courses/${data.name}/thumbnail`;

      // delete old thumbnail
      await cloudApi.delete_resources_by_prefix(folderPath);
      //
      await cloudUploader.upload(
        thumbnail.filepath,
        {
          folder: folderPath,
          transformation: {
            gravity: "face",
          },
        },
        async (error: any, result) => {
          if (error)
            return next(
              new ErrorHandler("Failed to upload image on server", 401)
            );

          const publicId = result?.public_id;

          const thumbnailId = publicId?.split("/").pop();

          const thumbnailUrl = result?.secure_url;

          data.thumbnail = {
            id: thumbnailId,
            url: thumbnailUrl,
          };
        }
      );
    }

    // for video upload
    if (Array.isArray(demoVideo))
      return next(new ErrorHandler("Multiple videos not allowed", 422));

    // 2. Check if the file is a video (not an image)
    if (!demoVideo.mimetype?.startsWith("video/")) {
      return next(
        new ErrorHandler(
          "Invalid video format. File must be a video (e.g., .mp4, .mov)",
          422
        )
      );
    }

    // 3. Validate file size (e.g., 100MB limit)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 100MB
    if (demoVideo.size > MAX_SIZE_BYTES) {
      return next(
        new ErrorHandler(
          `Video exceeds ${MAX_SIZE_BYTES / (1024 * 1024)}MB limit`,
          413 // Payload Too Large
        )
      );
    }

    // upload the demoVideo to the cloudinary db

    if (demoVideo) {
      // create a folder path
      const folderPath = `byWay/courses/${data.name}/demoVideo`;

      // delete old video
      await cloudApi.delete_resources_by_prefix(folderPath);

      await cloudUploader.upload(
        demoVideo.filepath,
        {
          folder: folderPath,
          resource_type: "video",
          chunk_size: 6000000,
          max_file_size: 10000000, // 30mb
          eager: [
            { width: 640, height: 360, crop: "scale" }, // Generate a lower-res version
          ],
        },
        async (error: any, result) => {
          if (error)
            return next(
              new ErrorHandler("Failed to upload video to server", 401)
            );

          const publicId = result?.public_id;

          const demoVideoId = publicId?.split("/").pop();

          const demoVideoUrl = result?.secure_url;

          data.demoVideo = {
            id: demoVideoId,
            url: demoVideoUrl,
          };
        }
      );
    }

    createCourse(data, res, next);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// edit course

export const editCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.course_id;
    const data = req.body;
    const { demoVideo, thumbnail } = req.files;

    // ensure price is a number
    data.price = +data.price;
    data.estimatedPrice = +data.estimatedPrice;
    data.price = +data.price;
    data.purchase = +data.purchase;

    //for the arrays
    const parsedBenefits = JSON.parse(data.benefits);
    const parsedPrerequisites = JSON.parse(data.prerequisites);
    const parsedCourseData = JSON.parse(data.courseData);

    data.prerequisites = parsedPrerequisites;
    data.benefits = parsedBenefits;
    data.courseData = parsedCourseData;

    // check if course exist
    const isCourseExist = await Course.findById(courseId);

    if (!isCourseExist) return next(new ErrorHandler("Course not found", 404));

    if (!demoVideo && !data.demoVideo)
      return next(new ErrorHandler("Upload Course Intro Video", 400));

    if (!data) return next(new ErrorHandler("Fields are missing", 400));

    // for image upload

    if (!data.thumbnail) {
      if (!thumbnail)
        return next(new ErrorHandler("Upload Course Banner", 400));

      if (Array.isArray(thumbnail))
        return next(new ErrorHandler("Multiple images not allowed", 422));

      if (!thumbnail.mimetype?.startsWith("image"))
        return next(
          new ErrorHandler(
            "Invalid image format. File must be an image(.jpg, .png, .jpeg)",
            422
          )
        );

      if (thumbnail) {
        const folderPath = `byWay/courses/${data.name}/thumbnail`;

        // delete old thumbnail
        await cloudApi.delete_resources_by_prefix(folderPath);
        //
        await cloudUploader.upload(
          thumbnail.filepath,
          {
            folder: folderPath,
            transformation: {
              gravity: "face",
            },
          },
          async (error: any, result) => {
            if (error)
              return next(
                new ErrorHandler("Failed to upload image on server", 401)
              );

            const publicId = result?.public_id;

            const thumbnailId = publicId?.split("/").pop();

            const thumbnailUrl = result?.secure_url;

            data.thumbnail = {
              id: thumbnailId,
              url: thumbnailUrl,
            };
          }
        );
      }
    }

    if (!data.demoVideo) {
      // for video upload
      if (Array.isArray(demoVideo))
        return next(new ErrorHandler("Multiple videos not allowed", 422));

      // 2. Check if the file is a video (not an image)
      if (!demoVideo.mimetype?.startsWith("video/")) {
        return next(
          new ErrorHandler(
            "Invalid format. File must be a video (e.g., .mp4, .mov)",
            422
          )
        );
      }

      // 3. Validate file size (e.g., 100MB limit)
      const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 100MB
      if (demoVideo.size > MAX_SIZE_BYTES) {
        return next(
          new ErrorHandler(
            `Video exceeds ${MAX_SIZE_BYTES / (1024 * 1024)}MB limit`,
            413 // Payload Too Large
          )
        );
      }

      // upload the demoVideo to the cloudinary db
      if (demoVideo) {
        // create a folder path
        const folderPath = `byWay/courses/${data.name}/demoVideo`;

        // delete old video
        await cloudApi.delete_resources_by_prefix(folderPath);

        await cloudUploader.upload(
          demoVideo.filepath,
          {
            folder: folderPath,
            resource_type: "video",
            chunk_size: 6000000,
            max_file_size: 10000000, // 30mb
            eager: [
              { width: 640, height: 360, crop: "scale" }, // Generate a lower-res version
            ],
          },
          async (error: any, result) => {
            if (error)
              return next(
                new ErrorHandler("Failed to upload image on server", 401)
              );

            const publicId = result?.public_id;

            const demoVideoId = publicId?.split("/").pop();

            const demoVideoUrl = result?.secure_url;

            data.demoVideo = {
              id: demoVideoId,
              url: demoVideoUrl,
            };
          }
        );
      }
    }

    // update course
    await Course.updateOne(
      { _id: courseId },
      {
        $set: data,
      },
      { new: true }
    );

    res.apiSuccess(null, "Course updated", 201);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get single course * without purchasing

export const getSingleCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.course_id;

    const course = await Course.findById(courseId).select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    if (!course) return next(new ErrorHandler("Course not found", 404));

    res.apiSuccess(course, "Course fetched");
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get all courses * without purchasing

export const getAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    if (!courses) return next(new ErrorHandler("Error fetching courses", 404));

    res.apiSuccess(courses, "Courses fetched");
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get course content * only for subscribed user

export const getCourseByUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.courses;

    const courseId = req.params.course_id;

    const courseExists = userCourseList.find(
      (course: any) => course.courseId === courseId
    );

    if (!courseExists)
      return next(
        new ErrorHandler("You are not eligible to access this course", 403)
      );

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const content = course.courseData;

    res.apiSuccess(content, "Course content fetched");
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add question to course content

interface IAddQuestion {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { question, contentId, courseId } = req.body as IAddQuestion;

    if (!question || !contentId || !courseId)
      return next(new ErrorHandler("Invalid entry", 422));

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    // console.log(isValidObjectId(contentId));

    if (!isValidObjectId(contentId))
      return next(new ErrorHandler("Invalid content id", 400));

    const courseContent = course.courseData.find((item: any) =>
      item._id.equals(contentId)
    );

    if (!courseContent) return next(new ErrorHandler("Content not found", 404));

    // create question object
    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };

    courseContent.questions.push(newQuestion);

    //   create notification
    await Notification.create({
      userId: req.user._id,
      title: "New Question Recieved",
      message: `You have a new question from ${course?.name} course in the ${courseContent.title} section`,
    });

    // save the updated course
    await course.save();

    // REDIS UPDATE
    const newCourse = await Course.findById(courseId);

    // update redis
    // await redis.set(`course - ${courseId}`, JSON.stringify(newCourse));

    // for redis update
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    if (!courses) return next(new ErrorHandler("Course not found", 404));

    // update all courses in redis too
    // await redis.set("allCourses", JSON.stringify(courses));

    res.apiSuccess(null, "Question submitted");
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add answer to  course content

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { answer, contentId, courseId, questionId } =
      req.body as IAddAnswerData;

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    if (!isValidObjectId(contentId))
      return next(new ErrorHandler("Invalid content id", 400));

    const courseContent = course.courseData.find((item: any) =>
      item._id.equals(contentId)
    );

    if (!courseContent) return next(new ErrorHandler("Content not found", 404));

    const question = courseContent.questions?.find((question: any) =>
      question._id.equals(questionId)
    );

    if (!question) return next(new ErrorHandler("Question not found", 404));

    // create a new answer object
    const newAnswer: any = {
      user: req.user,
      answer,
    };

    // push answer to the question replies array
    question.questionReplies.push(newAnswer);

    await course.save();

    // REDIS

    // const newCourse = await Course.findById(courseId);

    // update redis
    // await redis.set(`course - ${courseId}`, JSON.stringify(newCourse));

    // for redis update  courses
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    if (!courses) return next(new ErrorHandler("Course not found", 404));

    // update all courses in redis too
    // await redis.set("allCourses", JSON.stringify(courses));

    // send email notification to user
    if (req.user?._id === question.user._id) {
      // create a notification (because you answered the question yourself)

      await Notification.create({
        userId: req.user._id,
        title: "New Reply Received",
        message: `You have a new question reply from ${course.name} course in the ${courseContent.title} section`,
      });
    } else {
      // create notification as well
      await Notification.create({
        userId: req.user._id,
        title: "New  Reply Received",
        message: `You have a new question reply from ${course.name} course in the ${courseContent.title} section`,
      });
      // you answered someone else's question
      const data: any = {
        name: question.user.name,
        title: courseContent.title,
        question: question.question,
      };

      // to send email notification
      try {
        await sendMail({
          email: question.user.email,
          subject: "Question Reply",
          template: "question-reply.ejs",
          data,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }

    res.apiSuccess(null, "Reply submitted");
  }
);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// add review to course

interface IAddReviewData {
  rating: number;
  review: string;
}

export const addReview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    const userCourseList = await User.findById(userId);

    if (!userCourseList) return next(new ErrorHandler("User not found", 404));

    const courseId = req.params.course_id;

    const courseExists = userCourseList.courses.find(
      (course: any) => course.courseId === courseId
    );

    if (!courseExists)
      return next(
        new ErrorHandler("You are not allowed access to this course", 403)
      );

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const { rating, review } = req.body as IAddReviewData;

    const reviewData: any = {
      user: req.user,
      comment: review,
      rating,
    };

    course.reviews.push(reviewData);

    // to set the course ratings
    let avg = 0;

    course.reviews.forEach((review) => {
      avg += review.rating;
    });

    const averageCourseRatings = (avg / course.reviews?.length).toFixed(2);

    course.ratings = +averageCourseRatings;

    await course.save();

    //   create notification
    await Notification.create({
      userId: req.user._id,
      title: "New Review Recieved",
      message: `You have a new review from ${course.name} course.`,
    });

    // REDIS UPDATE
    // const newCourse = await Course.findById(courseId);

    // update redis
    // await redis.set(`course - ${courseId}`, JSON.stringify(newCourse));

    // for redis update
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    if (!courses) return next(new ErrorHandler("Course not found", 404));

    // update all courses in redis too
    // await redis.set("allCourses", JSON.stringify(courses));

    // update user reviewed course
    const user = await User.updateOne(
      {
        _id: userId,
        "courses.courseId": courseId,
      },
      { $set: { "courses.$.reviewed": true } },
      { arrayFilters: [{ "course.courseId": courseId }] }
    );

    if (!user) return next(new ErrorHandler("User not found", 404));

    const newUser = await User.findById(userId);

    //   update user to redis
    // await redis.set(
    //   `user - ${newUser?._id as string}`,
    //   JSON.stringify(newUser) as any
    // );

    res.apiSuccess(null, "Thanks for your feedback");
  }
);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// add reply to review

interface IAddReplyReviewData {
  reply: string;
  reviewId: string;
}

export const addReplyToReview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reply, reviewId } = req.body as IAddReplyReviewData;

    const courseId = req.params.course_id;

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const review = course.reviews.find(
      (review: any) => review._id.toString() === reviewId
    );

    if (!review) return next(new ErrorHandler("Review not found", 404));

    const newReply: any = {
      user: req.user,
      reply,
    };

    if (!review.commentReplies) {
      review.commentReplies = [];
    }

    review.commentReplies?.push(newReply);

    await course.save();

    // const newCourse = await Course.findById(courseId);

    // update redis
    // await redis.set(`course - ${courseId}`, JSON.stringify(newCourse));

    // for redis update
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    if (!courses) return next(new ErrorHandler("Course not found", 404));

    // update all courses in redis too
    // await redis.set("allCourses", JSON.stringify(courses));

    res.apiSuccess(null, "Reply submitted");
  }
);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// get all courses - admin only

export const getAdminAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    getAllCoursesService(res);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// delete course - admin only

export const deleteCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    await course.deleteOne();

    // await redis.del(`course - ${courseId}`);

    // for redis update
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    if (!courses) return next(new ErrorHandler("Course not found", 404));

    // update all courses in redis too
    // await redis.set("allCourses", JSON.stringify(courses));

    res.apiSuccess(null, "Course deleted");
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// generate video url

export const generateVideoUrl = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;

      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
