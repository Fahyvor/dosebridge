import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function formatArticle(a: any) {
  return {
    id: a.id,
    category: a.category,
    title: typeof a.title === 'string' ? JSON.parse(a.title) : a.title,
    summary: typeof a.summary === 'string' ? JSON.parse(a.summary) : a.summary,
    simpleContent: typeof a.simpleContent === 'string' ? JSON.parse(a.simpleContent) : a.simpleContent,
    keyTakeaways: typeof a.keyTakeaways === 'string' ? JSON.parse(a.keyTakeaways) : a.keyTakeaways,
    readTime: a.readTime,
    iconName: a.iconName,
  };
}

export const getResources = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const where = category && category !== 'all' ? { category } : {};
    const articles = await prisma.educationalArticle.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ success: true, data: articles.map(formatArticle) });
  } catch (error: any) {
    console.error('Error fetching resources:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching resources' });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const article = await prisma.educationalArticle.findUnique({
      where: { id },
    });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    return res.json({ success: true, data: formatArticle(article) });
  } catch (error: any) {
    console.error('Error fetching resource:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching resource' });
  }
};
