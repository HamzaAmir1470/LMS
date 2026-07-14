import React from "react";
import { styles } from "../styles/style";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="text-black dark:text-white py-8">
      <h1 className={`${styles.title} min-[800px]:!text-[45px] text-center`}>
        What is{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">
          DevLearn?
        </span>
        
      </h1>

      <div className="w-[95%] min-[800px]:w-[85%] m-auto mt-8 space-y-6 text-[18px] font-Poppins leading-relaxed">
        <p>
          Are you ready to take your coding skills to the next level? Look no
          further than DevLearn, the ultimate platform for learning and
          mastering programming languages. Our comprehensive courses cover
          everything from the basics to advanced topics, ensuring that you have
          the knowledge and skills you need to succeed in the tech industry.
          With our expert instructors and hands-on projects, you'll gain
          practical experience and build a strong foundation in coding. Join our
          community of learners today and start your journey towards becoming a
          skilled programmer!
        </p>

        <p>
          At DevLearn, we believe that learning to code should be accessible to
          everyone. That's why we offer a variety of courses and resources to
          help you learn at your own pace, whether you're a beginner or an
          experienced developer. Our platform is designed to be user-friendly
          and intuitive, making it easy for you to navigate and find the
          information you need. Plus, our community of learners is always here
          to support you, answer your questions, and provide feedback on your
          projects. So what are you waiting for? Sign up for DevLearn today and
          start your journey towards becoming a coding expert!
        </p>

        <p>
          Our mission at DevLearn is to empower individuals to achieve their
          goals and reach their full potential through coding education. We
          believe that coding is a valuable skill that can open up new
          opportunities and help you achieve your dreams. Whether you're looking
          to start a new career in tech, build your own projects, or simply
          learn a new skill, DevLearn has everything you need to succeed. Join
          us today and take the first step towards a brighter future!
        </p>

        <p>
          At DevLearn, we are committed to providing high-quality education and
          resources to help you achieve your goals. Our courses are designed to
          be engaging, interactive, and practical, giving you the skills and
          knowledge you need to succeed in the tech industry. We also offer a
          variety of tools and resources to help you stay motivated and on
          track, including progress tracking, quizzes, and coding challenges.
          With DevLearn, you'll have everything you need to become a skilled
          programmer and achieve your dreams.
        </p>
      </div>
    </div>
  );
};

export default About;
