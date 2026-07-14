import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div className="text-black dark:text-white py-8">
      {/* Title */}
      <h1 className={`${styles.title} min-[800px]:!text-[45px] text-center`}>
        Platform{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">
          Terms & Conditions
        </span>
      </h1>

      {/* Policy Content */}
      <div className="w-[95%] min-[800px]:w-[85%] m-auto mt-8 space-y-6 text-[18px] font-Poppins leading-relaxed">
        <p>
          Welcome to DevLearn. By accessing or using our platform, website, and
          services, you agree to be bound by these Terms and Conditions. Please
          read them carefully. If you do not agree with any part of these terms,
          you must not use or access our services.
        </p>

        <p>
          <strong className="text-blue-500 dark:text-purple-400">
            1. Account Registration & Security:
          </strong>{" "}
          To access certain features of DevLearn, you may be required to create
          an account. You agree to provide accurate, current, and complete
          information during registration. You are solely responsible for
          safeguarding your account credentials and for any activities or
          actions taken under your account.
        </p>

        <p>
          <strong className="text-blue-500 dark:text-purple-400">
            2. Intellectual Property Rights:
          </strong>{" "}
          All course materials, videos, coding exercises, designs, text,
          graphics, and software on DevLearn are the intellectual property of
          DevLearn or its licensors. You are granted a limited, personal,
          non-exclusive, and non-transferable license to access the content
          solely for your own personal, educational use.
        </p>

        <p>
          <strong className="text-blue-500 dark:text-purple-400">
            3. User Code of Conduct:
          </strong>{" "}
          We believe in maintaining a supportive and safe community. You agree
          not to share your account with others, reverse-engineer any part of
          the platform, distribute spam, or use abusive language in any
          community forums, comment sections, or interactive spaces. Violation
          of these rules may result in immediate suspension without refund.
        </p>

        <p>
          <strong className="text-blue-500 dark:text-purple-400">
            4. Modifications to Services & Terms:
          </strong>{" "}
          DevLearn reserves the right to modify, suspend, or discontinue any
          part of our courses or platform features at any time. We may also
          update these Terms & Conditions periodically. Your continued use of
          the platform after changes are posted constitutes your acceptance of
          the updated terms.
        </p>
      </div>
    </div>
  );
};

export default Policy;
