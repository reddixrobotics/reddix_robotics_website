export const ros2Curriculum = [
  {
    week: 'WEEK 01',
    title: 'ROBOTICS SOFTWARE ENGINEERING',
    days: [
      { day: 'DAY 1', title: 'Robotics Industry Orientation', learn: 'Industry standards and Reddix methodology.', build: 'Dev environment setup.', challenge: 'Configure ROS 2 humble on Ubuntu.', deliverable: 'Working ROS 2 workspace.' },
      { day: 'DAY 2', title: 'Linux for Robotics', learn: 'Advanced terminal, bash scripting.', build: 'Custom startup scripts.', challenge: 'Automate workspace sourcing.', deliverable: 'Bash configuration.' },
      { day: 'DAY 3', title: 'ROS 2 Architecture', learn: 'Nodes, Topics, Services, Actions.', build: 'Basic publisher/subscriber.', challenge: 'Custom message communication.', deliverable: 'ROS 2 package.' },
      { day: 'DAY 4', title: 'Python/C++ ROS 2 Nodes', learn: 'OOP in ROS 2.', build: 'Complex node structures.', challenge: 'Multithreading and callbacks.', deliverable: 'OOP Node package.' },
      { day: 'DAY 5', title: 'ROS 2 Engineering Workflow', learn: 'Colcon, Launch files, Parameters.', build: 'Modular launch system.', challenge: 'Launch multiple nodes dynamically.', deliverable: 'Launch configuration.' },
      { day: 'DAY 6', title: 'Debugging Day', learn: 'RQT, ROS2 CLI, logging.', build: 'Debug simulated errors.', challenge: 'Find and fix 3 hidden bugs.', deliverable: 'Debugging report.' },
      { day: 'DAY 7', title: 'Week 1 Engineering Review', learn: 'Code review practices.', build: 'Refactor week 1 code.', challenge: 'Optimize node performance.', deliverable: 'Cleaned repository.' },
    ]
  },
  {
    week: 'WEEK 02',
    title: 'BUILD THE ROBOT',
    days: [
      { day: 'DAY 8', title: 'Robot Architecture', learn: 'Kinematics, coordinate frames.', build: 'Robot schematic.', challenge: 'Map robot joints.', deliverable: 'Architecture diagram.' },
      { day: 'DAY 9', title: 'URDF/Xacro', learn: 'Robot modeling.', build: 'Kushi robot URDF.', challenge: 'Parameterize dimensions with Xacro.', deliverable: 'URDF model.' },
      { day: 'DAY 10', title: 'TF2', learn: 'Transform trees.', build: 'TF broadcaster/listener.', challenge: 'Resolve TF tree conflicts.', deliverable: 'Working TF tree.' },
      { day: 'DAY 11', title: 'Gazebo Simulation', learn: 'Physics engines, plugins.', build: 'Simulated environment.', challenge: 'Spawn robot with correct physics.', deliverable: 'Gazebo world.' },
      { day: 'DAY 12', title: 'Robot Control', learn: 'ros2_control, hardware interfaces.', build: 'Differential drive controller.', challenge: 'Tune PID for movement.', deliverable: 'Moving simulated robot.' },
      { day: 'DAY 13', title: 'Sensor Integration', learn: 'LIDAR, Cameras, IMU in simulation.', build: 'Sensor plugins.', challenge: 'Process raw point clouds.', deliverable: 'Sensor data visualization in RViz2.' },
      { day: 'DAY 14', title: 'Hardware Bring-Up', learn: 'Connecting physical to digital.', build: 'Hardware interface mock.', challenge: 'Simulate hardware failure.', deliverable: 'Robust bring-up script.' },
    ]
  },
  {
    week: 'WEEK 03',
    title: 'AUTONOMY',
    days: [
      { day: 'DAY 15', title: 'Odometry & Localization', learn: 'Wheel odometry, EKF.', build: 'Robot pose estimation.', challenge: 'Fuse IMU and Odom.', deliverable: 'Accurate robot localization.' },
      { day: 'DAY 16', title: 'SLAM', learn: 'Simultaneous Localization and Mapping.', build: 'Mapping node.', challenge: 'Map a complex simulated warehouse.', deliverable: '2D Occupancy Grid Map.' },
      { day: 'DAY 17', title: 'SLAM Debugging', learn: 'Map optimization.', build: 'Fix drift and loop closures.', challenge: 'Correct a broken map.', deliverable: 'Optimized Map.' },
      { day: 'DAY 18', title: 'Localization', learn: 'AMCL.', build: 'Particle filter localization.', challenge: 'Kidnapped robot problem.', deliverable: 'Robust localization.' },
      { day: 'DAY 19', title: 'Nav2 Architecture', learn: 'Behavior trees, action servers.', build: 'Nav2 stack configuration.', challenge: 'Custom behavior tree.', deliverable: 'Nav2 setup.' },
      { day: 'DAY 20', title: 'Costmaps', learn: 'Global/Local costmaps, obstacles.', build: 'Costmap tuning.', challenge: 'Navigate tight corridors.', deliverable: 'Tuned costmaps.' },
      { day: 'DAY 21', title: 'Autonomous Navigation', learn: 'Path planning, controllers.', build: 'Point-to-point navigation.', challenge: 'Dynamic obstacle avoidance.', deliverable: 'Autonomous movement.' },
    ]
  },
  {
    week: 'WEEK 04',
    title: 'AI + INDUSTRIAL ENGINEERING',
    days: [
      { day: 'DAY 22', title: 'Navigation Engineering', learn: 'Advanced Nav2 plugins.', build: 'Custom recovery behaviors.', challenge: 'Escape dead ends.', deliverable: 'Advanced Nav2 configuration.' },
      { day: 'DAY 23', title: 'Computer Vision', learn: 'OpenCV basics.', build: 'Image processing node.', challenge: 'Detect specific colors/shapes.', deliverable: 'Vision node.' },
      { day: 'DAY 24', title: 'YOLO + ROS 2', learn: 'AI Object detection.', build: 'YOLO inference node.', challenge: 'Detect and publish object coordinates.', deliverable: 'AI detection pipeline.' },
      { day: 'DAY 25', title: 'Robot Intelligence', learn: 'Decision making.', build: 'State machine for mission.', challenge: 'Navigate to object and stop.', deliverable: 'Mission logic.' },
      { day: 'DAY 26', title: 'Industrial Mission', learn: 'System integration.', build: 'Warehouse patrol mission.', challenge: 'Complete mission within time limit.', deliverable: 'Full autonomous mission.' },
      { day: 'DAY 27', title: 'Deployment Engineering', learn: 'Docker for robotics.', build: 'Containerized ROS 2 app.', challenge: 'Deploy without local dependencies.', deliverable: 'Docker image.' },
      { day: 'DAY 28', title: 'Reliability & Testing', learn: 'Unit tests in ROS 2.', build: 'Test suite for nodes.', challenge: 'Achieve 80% coverage.', deliverable: 'Test report.' },
      { day: 'DAY 29', title: 'Final Engineering Challenge', learn: 'End-to-end debugging.', build: 'Fix intentional system failure.', challenge: 'Restore full functionality.', deliverable: 'System recovery.' },
      { day: 'DAY 30', title: 'REDDIX DEMO DAY', learn: 'Presentation and demonstration.', build: 'Final project showcase.', challenge: 'Live demo.', deliverable: 'Technical Presentation & Video.' },
    ]
  }
];

export const ros2Faq = [
  { question: 'Do I need previous ROS 2 experience?', answer: 'No, we start from the absolute basics, assuming no prior ROS 2 knowledge, but you must be ready for an intensive learning curve.' },
  { question: 'Do I need to know Linux?', answer: 'Basic familiarity is helpful, but we cover the essential Linux commands and architecture needed for robotics in the first few days.' },
  { question: 'Do I need Python or C++ experience?', answer: 'Yes, basic programming knowledge in Python or C++ is required to write ROS 2 nodes and logic.' },
  { question: 'Will I work with a real robot?', answer: 'This program is heavily focused on the full software stack and simulation using Gazebo to model the Kushi platform, preparing you for real hardware.' },
  { question: 'Will I build my own projects?', answer: 'Yes, every week involves hands-on building, culminating in an autonomous warehouse robot capstone project.' },
  { question: 'Will I receive a certificate?', answer: 'You will receive the Reddix Engineering Passport, which details the specific skills and technologies you have applied and mastered.' },
  { question: 'What is the Reddix Engineering Passport?', answer: 'It is a digital portfolio detailing your technical proficiencies in Linux, ROS 2, SLAM, Nav2, and AI, acting as proof of your engineering capabilities.' },
  { question: 'Will there be mentorship?', answer: 'Yes, you will have access to industry experts and our AI Robotics Mentor system to guide you through debugging and architecture.' },
  { question: 'What is the AI Robotics Mentor?', answer: 'It is a specialized AI assistant trained on ROS 2 and Reddix methodologies to help you diagnose errors, understand TF trees, and debug nodes in real-time.' },
  { question: 'What happens on Day 30?', answer: 'Day 30 is Demo Day. There is no written exam. You must demonstrate your working autonomous robot system, showing the architecture, TF tree, SLAM, and AI integration.' },
];
