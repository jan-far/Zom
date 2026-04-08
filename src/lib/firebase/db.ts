import { db } from './config';
import { collection, doc, setDoc, getDoc, getDocs, query, where, addDoc } from 'firebase/firestore';

export interface Project {
  id?: string;
  userId: string;
  title: string;
  description: string;
  createdAt: Date;
}

export interface Paper {
  id?: string;
  projectId: string;
  title: string;
  authors: string[];
  year: number;
  doi?: string;
  abstract?: string;
  url?: string;
}

export interface Synthesis {
  id?: string;
  paperId: string;
  territory: string; // Move 1
  niche: string; // Move 2
  occupyingNiche: string; // Move 3
  methodology: string;
}

export const createProject = async (project: Omit<Project, 'createdAt'>) => {
  const projectRef = await addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: new Date()
  });
  return projectRef.id;
};

export const getProjectsForUser = async (userId: string) => {
  const q = query(collection(db, 'projects'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const addPaperToProject = async (paper: Paper) => {
  const paperRef = await addDoc(collection(db, `projects/${paper.projectId}/papers`), paper);
  return paperRef.id;
};

export const saveSynthesisForPaper = async (projectId: string, paperId: string, synthesis: Omit<Synthesis, 'paperId'>) => {
  const synthesisRef = doc(db, `projects/${projectId}/synthesis`, paperId);
  await setDoc(synthesisRef, {
    paperId,
    ...synthesis
  });
  return paperId;
};