import { ContextEmailStrategy, EmailBody, EmailProvidersType, SendEmailStrategy } from "./email.strategy";
import { SendEmailNodemailerService } from "./nodemailer.service";

export class ContextEmailService implements ContextEmailStrategy
{
    private providers: Record<EmailProvidersType, SendEmailStrategy> = {
        "gmail": new SendEmailNodemailerService("gmail"),
        "outlook": new SendEmailNodemailerService("outlook")
    }


    async executeSendEmail(message: EmailBody, provider: EmailProvidersType): Promise<void> {
        this.providers[provider].sendEmail(message)
    }
}