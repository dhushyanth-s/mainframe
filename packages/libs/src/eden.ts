import { edenTreaty } from '@elysiajs/eden';
import type { App } from 'api';

export const api: ReturnType<typeof edenTreaty<App>> = edenTreaty<App>('http://localhost:3000/');
