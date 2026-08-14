export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  description: string;
}

export interface Internship {
  id: string;
  title: string;
  department: string;
  duration: string;
  location: string;
  skills: string[];
  description: string;
}

export interface Workshop {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  duration: string;
  location: string;
  description: string;
}

export const jobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior SLAM Engineer',
    department: 'Autonomous Systems',
    location: 'London, UK (Hybrid)',
    type: 'Full-time',
    experience: '5+ years',
    skills: ['C++', 'ROS 2', 'Computer Vision', 'Kalman Filters'],
    description: 'Lead the development of state-of-the-art simultaneous localization and mapping (SLAM) algorithms for our next-generation mobile robots operating in dynamic, unmapped environments.'
  },
  {
    id: 'job-2',
    title: 'Mechatronics Engineer',
    department: 'Hardware',
    location: 'Tokyo, JP (On-site)',
    type: 'Full-time',
    experience: '3+ years',
    skills: ['SolidWorks', 'Actuator Design', 'Control Theory'],
    description: 'Design and prototype precision robotic end-effectors and joint actuators. You will work closely with the software team to ensure seamless hardware-software integration.'
  },
  {
    id: 'job-3',
    title: 'Machine Learning Researcher',
    department: 'AI Research',
    location: 'Remote',
    type: 'Full-time',
    experience: 'PhD or 4+ years',
    skills: ['PyTorch', 'Reinforcement Learning', 'Python'],
    description: 'Conduct applied research in deep reinforcement learning to enable robotic systems to learn new manipulation tasks with minimal human intervention.'
  },
  {
    id: 'job-4',
    title: 'Embedded Systems Developer',
    department: 'Firmware',
    location: 'New York, US (Hybrid)',
    type: 'Full-time',
    experience: '3+ years',
    skills: ['C', 'Rust', 'RTOS', 'Microcontrollers'],
    description: 'Develop highly reliable, real-time firmware for motor controllers and sensor interfaces. Focus on safety, low latency, and fault tolerance.'
  }
];

export const internships: Internship[] = [
  {
    id: 'int-1',
    title: 'Robotics Software Intern',
    department: 'Autonomous Systems',
    duration: '12 Weeks (Summer)',
    location: 'London, UK',
    skills: ['Python', 'C++', 'Basic ROS'],
    description: 'Assist the autonomous systems team in testing and benchmarking path-planning algorithms in both simulated and real-world environments.'
  },
  {
    id: 'int-2',
    title: 'Computer Vision Research Intern',
    department: 'AI Research',
    duration: '6 Months',
    location: 'Remote',
    skills: ['Python', 'OpenCV', 'Deep Learning Concepts'],
    description: 'Work alongside senior researchers to annotate datasets, train object detection models, and deploy models to edge devices for performance testing.'
  }
];

export const workshops: Workshop[] = [
  {
    id: 'ws-1',
    title: 'Introduction to ROS 2 for Industry',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 15, 2026',
    duration: '2 Days',
    location: 'London HQ & Virtual',
    description: 'A hands-on workshop covering the fundamentals of ROS 2, node communication, and deploying your first autonomous package on hardware.'
  },
  {
    id: 'ws-2',
    title: 'Advanced Robotic Manipulation',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    date: 'Nov 10, 2026',
    duration: '1 Day',
    location: 'Tokyo Robotics Lab',
    description: 'Deep dive into inverse kinematics, torque control, and implementing safety constraints for 6-axis industrial arms.'
  }
];
