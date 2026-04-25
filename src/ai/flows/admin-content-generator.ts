
'use server';
/**
 * @fileOverview Цей файл реалізує потік Genkit для адміністративного інструменту з ШІ.
 * Допомагає персоналу клубу генерувати чернетки новин або підсумки статей про фітнес.
 * 
 * ВАЖЛИВО: Весь контент має генеруватися УКРАЇНСЬКОЮ мовою.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NewsPostDraftInputSchema = z.object({
  type: z.literal('news_post_draft'),
  topic: z.string().min(1).describe('Основна тема для чернетки новини.'),
  details: z.string().optional().describe('Додаткові деталі або специфічні інструкції.'),
});

const ArticleSummaryInputSchema = z.object({
  type: z.literal('article_summary'),
  articleContent: z.string().min(1).describe('Повний текст статті про фітнес для підсумку.'),
});

const AdminContentGeneratorInputSchema = z.discriminatedUnion('type', [
  NewsPostDraftInputSchema,
  ArticleSummaryInputSchema,
]);
export type AdminContentGeneratorInput = z.infer<typeof AdminContentGeneratorInputSchema>;

const AdminContentGeneratorOutputSchema = z.object({
  generatedContent: z.string().describe('Згенерована новина або підсумок статті українською мовою.'),
  contentType: z.enum(['news_post_draft', 'article_summary']).describe('Тип згенерованого контенту.'),
});
export type AdminContentGeneratorOutput = z.infer<typeof AdminContentGeneratorOutputSchema>;

const adminContentPrompt = ai.definePrompt({
  name: 'adminContentGeneratorPrompt',
  input: { schema: AdminContentGeneratorInputSchema },
  output: { schema: AdminContentGeneratorOutputSchema },
  prompt: `Ви — ШІ-асистент для ZenithFit, преміального фітнес-клубу. Ваша роль — допомагати адміністраторам створювати контент для новинної стрічки клубу УКРАЇНСЬКОЮ мовою. Тон має бути професійним, енергійним та відповідати преміальному бренду.

{{#if topic}}
Ваше завдання — написати цікаву новину для ZenithFit українською мовою.
Тема: {{{topic}}}
{{#if details}}
Ключові деталі: {{{details}}}
{{/if}}

Створіть переконливу чернетку новини.
{{else if articleContent}}
Ваше завдання — зробити короткий підсумок (summary) статті про фітнес для стрічки новин українською мовою.

Текст статті:
{{{articleContent}}}

Надайте стислий та професійний підсумок.
{{/if}}
`,
});

const adminContentGeneratorFlow = ai.defineFlow(
  {
    name: 'adminContentGeneratorFlow',
    inputSchema: AdminContentGeneratorInputSchema,
    outputSchema: AdminContentGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await adminContentPrompt(input);
    if (!output) {
      throw new Error('ШІ не зміг згенерувати контент.');
    }
    return output;
  }
);

export async function generateAdminContent(
  input: AdminContentGeneratorInput
): Promise<AdminContentGeneratorOutput> {
  return adminContentGeneratorFlow(input);
}
