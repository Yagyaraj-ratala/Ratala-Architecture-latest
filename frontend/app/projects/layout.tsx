import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Projects - Interior Design Showcase',
  description: 'Explore our interior design projects and get inspired for your next project',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
