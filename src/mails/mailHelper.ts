import { sendEmailDto } from './dto/sendEmail.dto';
import { MailService } from './mails.service';

export const Mailer = (mailService: MailService) => {
  // onboardng emails
  const welcomeEmail = async (data: { name: string; email: string }) => {
    const payload: sendEmailDto = {
      recipients: data.email,
      subject: 'Welcome to Our Platform!',
      template: 'welcome.ejs',
      context: {
        name: data.name,
        email: data.email,
        link: '',
      },
    };

    await mailService.sendEmail(payload);
  };
  const resetPasswordEmail = async (data: {
    name: string;
    email: string;
    link: string;
  }) => {
    const payload: sendEmailDto = {
      recipients: data.email,
      subject: 'Reset Your Password',
      template: 'reset-password.ejs',
      context: {
        name: data.name,
        email: data.email,
        link: data.link,
      },
    };

    await mailService.sendEmail(payload);
  };
  const bookingConfirmationEmail = async (data: {
    name: string;
    email: string;
    bookingDetails: string;
  }) => {
    const payload: sendEmailDto = {
      recipients: data.email,
      subject: 'Booking Confirmation',
      template: 'booking-confirmation.ejs',
      context: {
        name: data.name,
        email: data.email,
        bookingDetails: data.bookingDetails,
      },
    };
    await mailService.sendEmail(payload);
  };
  return {
    welcomeEmail,
    resetPasswordEmail,
    bookingConfirmationEmail,
  };
};
export default Mailer;
