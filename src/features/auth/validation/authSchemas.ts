import { z } from 'zod';

import { PASSWORD_MIN_LENGTH } from '../../../utils/validation';
import { REGEX } from '../../../constants/regex';

/**
 * Messages are i18n keys, not sentences: zod runs outside React, where the
 * translator is not available, so the form resolves the key when it renders.
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'validation:required').regex(REGEX.email, 'validation:email'),
  password: z.string().min(1, 'validation:required'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, 'validation:required'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, 'validation:passwordWeak')
    .regex(REGEX.password, 'validation:passwordWeak'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
