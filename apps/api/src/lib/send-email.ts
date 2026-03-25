import { Resend } from 'resend';

type SendEmailOptions = {
	to: string | string[];
	subject: string;
	html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY || '');

export const sendEmail = async (options: SendEmailOptions) => {
	const { data, error } = await resend.emails.send({
		from: 'Recrm <onboarding@resend.dev>',
		to: options.to,
		subject: options.subject,
		html: `${options.html}`,
	});

	if (error) {
		return console.error({ error });
	}

	console.log('Email sent successfully!', { data });
};
