import { z } from 'zod';

// auth
export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const registerSchema = z
	.object({
		name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(8),
		passwordConfirm: z.string().min(8)
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['confirmPassword'] // refine 함수에서 오류 위치를 지정
	});

// event
const eventSchema = z.object({
	chat_msgs: z.nullable(z.string()),
	chat_type: z.nullable(z.string()), 
	createdAt: z.string().datetime(), 
	due_at: z.nullable(z.string().datetime()),
	end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // end_date should be a date string in YYYY-MM-DD format
	id: z.string(),
	milestone: z.boolean(), 
	progressRate: z.number().int(), 
	start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // start_date should be a date string in YYYY-MM-DD format
	title: z.string(), 
	updatedAt: z.string().datetime(), 
	user: z.string() 
});
export type Event = z.infer<typeof eventSchema>;