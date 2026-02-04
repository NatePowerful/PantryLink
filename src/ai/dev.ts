import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-recipient-needs.ts';
import '@/ai/flows/suggest-recipient-matches.ts';
import '@/ai/flows/recipient-needs-assessment.ts';