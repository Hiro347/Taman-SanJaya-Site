import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProjectById, getOtherProjects, getSiteSettings, getProjects } from '@/lib/data';
import ProjectDetailView from '@/components/ProjectDetailView';

export const revalidate = 60;

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    id: project.slug || project.id,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectById(params.id);
  if (!project) {
    return {
      title: 'Proyek Tidak Ditemukan - Taman San Jaya',
    };
  }

  return {
    title: `${project.title} | Proyek Taman San Jaya`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Taman San Jaya`,
      description: project.description,
      images: [
        {
          url: project.image_url,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const [project, otherProjects, settings] = await Promise.all([
    getProjectById(params.id),
    getOtherProjects(params.id, 3),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailView
      project={project}
      otherProjects={otherProjects}
      settings={settings}
    />
  );
}
