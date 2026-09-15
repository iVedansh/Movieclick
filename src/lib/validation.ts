import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  venue: z.string().min(1, 'Venue is required'),
  starts_at: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Event date must be in the future',
  }),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  rows: z.coerce.number().min(1).max(20),
  cols: z.coerce.number().min(1).max(20),
});

export type EventFormData = z.infer<typeof eventSchema>;
