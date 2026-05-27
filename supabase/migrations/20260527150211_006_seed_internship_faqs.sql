/*
  # Seed Internship and AI Learning FAQs

  This migration adds realistic internship-focused FAQs covering:
  - Internship basics and onboarding
  - NOC and documentation
  - Team formation and collaboration
  - LMS and course management
  - Certificates and evaluations
  - Mentorship and daily workflow
  - GitHub setup and open source
  - AI coursework and learning paths
  - Troubleshooting and support
*/

DELETE FROM faqs WHERE created_by IS NULL;

-- Internship Basics
INSERT INTO faqs (question, description, category, tags, view_count, is_resolved) VALUES
('What is the duration of the internship program?',
'The internship program typically runs for 8-12 weeks, depending on the track you select. The AI/ML track is 12 weeks, while the Web Development track is 8 weeks. Extensions may be granted based on project completion and mentor recommendation.',
'internship', ARRAY['duration', 'timeline', 'schedule'], 156, true),

('How do I apply for the internship program?',
'To apply: 1) Visit the careers portal 2) Select your preferred track 3) Complete the application form 4) Upload your resume and portfolio 5) Submit the coding assessment within 48 hours. Applications are reviewed weekly.',
'internship', ARRAY['application', 'apply', 'process'], 189, true),

('Can I do this internship remotely?',
'Yes! Our internship program is fully remote. You will need a stable internet connection, a computer with at least 8GB RAM, and access to Zoom for daily standups. All materials and sessions are conducted online.',
'internship', ARRAY['remote', 'work-from-home', 'online'], 234, true),

('What are the prerequisites for joining?',
'Requirements vary by track. AI/ML track: Python fundamentals, basic linear algebra, and statistics. Web Development: JavaScript, HTML/CSS, and basic React knowledge. All tracks require Git/GitHub familiarity.',
'internship', ARRAY['prerequisites', 'requirements', 'skills'], 145, true),

('Is there a stipend for interns?',
'Yes, selected interns receive a monthly stipend based on performance tier. Tier 1: $500/month, Tier 2: $750/month, Tier 3: $1000/month. Tier placement is determined during the interview.',
'internship', ARRAY['stipend', 'payment', 'compensation'], 312, true),

-- NOC & Documentation
('How do I submit my NOC (No Objection Certificate)?',
'Upload your NOC to the Documents section in your dashboard. Required format: PDF, max 2MB. The NOC must be on your institution letterhead, signed by your HOD or Dean, and dated within 30 days of application.',
'documentation', ARRAY['noc', 'documents', 'upload'], 278, true),

('What documents are required for enrollment?',
'Required: 1) College ID card 2) Latest marksheet/transcript 3) Resume 4) NOC from institution 5) Government ID proof 6) Profile photo. International students: Additional valid visa documentation required.',
'documentation', ARRAY['enrollment', 'documents', 'required'], 198, true),

('Can I update my submitted documents?',
'Yes, you can update documents before the verification deadline. Go to Dashboard > Documents > Edit. After verification, contact support with the reason for change. Allow 2-3 days for re-verification.',
'documentation', ARRAY['update', 'documents', 'edit'], 89, true),

('What if my NOC is rejected?',
'Common rejection reasons: missing signature, incorrect format, expired date, wrong letterhead. You will receive an email with specific rejection details. Resubmit with corrections within 5 business days.',
'documentation', ARRAY['noc', 'rejected', 'resubmit'], 134, true),

-- Team Formation
('How are teams allocated for projects?',
'Teams are formed during Week 2 based on skill assessment results, timezone compatibility, and project preferences. Each team has 3-5 members with complementary skills.',
'team', ARRAY['team', 'allocation', 'group'], 167, true),

('Can I choose my own team members?',
'Yes, during Week 1 you can submit team preferences through the portal. Both members must mutually select each other. Final team composition is subject to skill balance requirements and mentor approval.',
'team', ARRAY['team', 'preferences', 'selection'], 145, true),

('What if I have issues with my team?',
'Mentors facilitate weekly team health checks. For conflicts: 1) Discuss with teammates 2) Escalate to mentor if unresolved 3) Request mediation session. Team restructuring is possible during Week 3-4.',
'team', ARRAY['conflict', 'issues', 'team-change'], 112, true),

('Can I work on a solo project?',
'Solo projects are available for interns with demonstrated experience. Submit a portfolio showcasing 3+ completed projects. Solo projects have higher evaluation standards.',
'team', ARRAY['solo', 'individual', 'project'], 98, true),

-- LMS & Courses
('How do I access the LMS portal?',
'Login at lms.internship.org with your registered email. First-time users: click Forgot Password to set credentials. The LMS contains all course materials, assignments, and progress tracking.',
'lms', ARRAY['lms', 'login', 'access'], 234, true),

('What courses are included in my track?',
'AI/ML Track: Python for ML, Data Preprocessing, Neural Networks, NLP, Computer Vision, MLOps. Web Track: Advanced React, Node.js, Database Design, Cloud Deployment, Testing.',
'lms', ARRAY['courses', 'curriculum', 'syllabus'], 189, true),

('How is my progress tracked?',
'Progress is tracked through: 1) Course completion percentage 2) Assignment scores 3) Project milestones 4) Attendance 5) Peer reviews. Dashboard shows real-time progress.',
'lms', ARRAY['progress', 'tracking', 'dashboard'], 167, true),

('Can I repeat a course if I do not understand?',
'Yes, all courses remain accessible throughout your internship. Re-watch lectures, retry quizzes (best of 3 attempts), and review materials anytime. Request 1:1 sessions with your mentor for additional help.',
'lms', ARRAY['repeat', 'retake', 'learning'], 134, true),

-- Certificates
('When will I receive my internship certificate?',
'Certificates are issued within 7 business days after: 1) All project submissions complete 2) Final evaluation passed 3) Exit interview conducted 4) All feedback forms submitted.',
'certificates', ARRAY['certificate', 'completion', 'graduation'], 289, true),

('What if I fail the final evaluation?',
'One re-evaluation attempt is allowed within 7 days. You must resubmit the project with improvements addressing feedback points. If unsuccessful again, you receive a participation certificate.',
'certificates', ARRAY['evaluation', 'fail', 're-evaluation'], 156, true),

('Can I get a recommendation letter?',
'Recommendation letters are provided to interns who: 1) Complete with distinction (90%+ score) 2) Have positive mentor evaluation 3) Contribute to open source. Request through Dashboard > Documents.',
'certificates', ARRAY['recommendation', 'letter', 'reference'], 123, true),

('Is the certificate verified and recognized?',
'Yes, all certificates have unique verification codes and QR links. Certificates are recognized by 200+ partner companies. Alumni have used certificates for university credits and job applications globally.',
'certificates', ARRAY['verified', 'recognized', 'accredited'], 178, true),

-- Attendance
('What is the attendance policy?',
'Minimum 80% attendance required for certificate eligibility. Attendance is tracked via daily standups (10 min) and weekly sessions. Excused absences: medical emergency, approved academic conflict.',
'attendance', ARRAY['attendance', 'policy', 'rules'], 245, true),

('What happens if I miss a Zoom session?',
'Zoom sessions are recorded. If you miss: 1) Watch recording within 48h 2) Complete session quiz 3) Post questions in discussion forum. Missing 3+ live sessions without notice affects participation score.',
'attendance', ARRAY['zoom', 'session', 'missed'], 198, true),

('Can I change my batch timing?',
'Batch time changes are allowed during Week 1 only, subject to seat availability. Submit request through Support > Batch Change. Changes after Week 1 require mentor approval.',
'attendance', ARRAY['batch', 'timing', 'schedule'], 145, true),

-- Interviews
('How do I prepare for the technical interview?',
'Prepare: 1) Review data structures and algorithms 2) Practice coding problems 3) Know your resume projects deeply 4) Prepare questions about the program. Interviews are 45 min: intro, coding, Q&A.',
'interviews', ARRAY['interview', 'preparation', 'technical'], 234, true),

('What coding languages can I use in interviews?',
'Any language is acceptable. We recommend: Python, JavaScript, Java, or C++. Pseudocode is acceptable with explanation. Focus on clarity rather than perfect syntax.',
'interviews', ARRAY['languages', 'coding', 'interview'], 167, true),

('Is there a take-home assignment after interview?',
'Some tracks include a 24-hour take-home project. You will receive requirements doc, starter code, and submission guidelines. Original work only - plagiarism results in disqualification.',
'interviews', ARRAY['assignment', 'take-home', 'project'], 134, true),

-- GitHub Setup
('How do I set up GitHub for the internship?',
'1) Create GitHub account with institutional email 2) Enable 2FA 3) Join organization via invite 4) Set up SSH keys 5) Clone starter repo 6) Verify access by creating a test PR. Video tutorial in Week 1.',
'github', ARRAY['github', 'setup', 'repository'], 278, true),

('Can I use a different email for GitHub?',
'We recommend using your institutional email for consistency. You can link multiple emails to one GitHub account. Ensure your GitHub profile shows your real name for certificate matching.',
'github', ARRAY['email', 'github', 'account'], 156, true),

('How do I submit code via pull requests?',
'1) Create feature branch 2) Commit changes with clear messages 3) Push to your fork 4) Open PR with description 5) Link to relevant issue 6) Request review from mentor 7) Address feedback 8) Merge after approval.',
'github', ARRAY['pull-request', 'pr', 'code-review'], 189, true),

-- Open Source
('What open source projects will we contribute to?',
'Projects selected based on track and skill level. AI/ML: scikit-learn, TensorFlow models, NLP tools. Web: React libraries, Node packages, accessibility tools. Teams can propose original projects.',
'opensource', ARRAY['open-source', 'contribution', 'projects'], 145, true),

('How are open source contributions evaluated?',
'Evaluations based on: 1) PR quality and complexity 2) Code review responsiveness 3) Documentation quality 4) Community interaction 5) Issue triage help. Minimum 2 merged PRs required.',
'opensource', ARRAY['evaluation', 'contribution', 'pr'], 123, true),

-- AI Coursework
('What AI/ML topics are covered?',
'Curriculum: Supervised/Unsupervised Learning, Neural Networks, CNN, RNN, Transformers, Transfer Learning, MLOps and Model Deployment, Ethics in AI. Practical modules use TensorFlow, PyTorch, and Hugging Face.',
'ai-coursework', ARRAY['ai', 'ml', 'curriculum'], 198, true),

('Is prior AI experience required?',
'No prior AI experience required for introduction tracks. However, strong Python skills and basic math (linear algebra, statistics, calculus) are essential. Advanced tracks require demonstrated ML experience.',
'ai-coursework', ARRAY['experience', 'prerequisites', 'requirements'], 167, true),

('What hardware do I need for AI coursework?',
'Basic: Modern laptop with 8GB+ RAM. AI training: Google Colab (free tier) provided. For local training: GPU recommended (NVIDIA GTX 1650 or equivalent). Cloud credits provided after Week 4.',
'ai-coursework', ARRAY['hardware', 'gpu', 'compute'], 145, true),

-- Zoom Sessions
('Are Zoom sessions mandatory?',
'Live sessions are highly recommended. Key sessions (evaluations, project kickoffs) are mandatory. All sessions are recorded and available within 2 hours. Attendance tracked via Zoom login.',
'sessions', ARRAY['zoom', 'mandatory', 'sessions'], 234, true),

('What if I have connectivity issues?',
'Use stable WiFi whenever possible. If issues occur: 1) Turn off video 2) Use phone dial-in 3) Join via mobile app. Report persistent issues to tech support. Accommodations available.',
'sessions', ARRAY['connectivity', 'internet', 'issues'], 178, true),

-- Mentorship
('When will I be assigned a mentor?',
'Mentors are assigned by end of Week 1 based on track, timezone, and project domain. You will receive an email introduction with scheduled meeting times.',
'mentorship', ARRAY['mentor', 'assignment', 'matching'], 267, true),

('How often do I meet with my mentor?',
'Standard: Weekly 1:1 (30 min) plus Daily standup (10 min) plus optional Office hours. Book additional sessions through the calendar link. Mentors respond to Slack messages within 24 hours.',
'mentorship', ARRAY['meetings', 'frequency', 'sessions'], 198, true),

('Can I request a mentor change?',
'Yes, but only after 2 weeks with current mentor. Submit request with specific reasons to program coordinator. Changes granted for timezone mismatch, skill mismatch, or documented issues.',
'mentorship', ARRAY['mentor-change', 'request', 'issues'], 89, true),

-- Daily Workflow
('What is the daily standup format?',
'Daily standup (10 min): 1) What did you accomplish yesterday 2) What is today plan 3) Any blockers. Camera on is encouraged. If unable to attend, post update in standup Slack channel before EOD.',
'workflow', ARRAY['standup', 'daily', 'routine'], 234, true),

('How do I track my daily tasks?',
'Use the integrated task board in Dashboard or connect your GitHub projects. Create weekly milestones, break tasks into daily chunks, update status daily. Weekly progress report auto-generated.',
'workflow', ARRAY['tasks', 'tracking', 'workflow'], 167, true),

-- Project Submission
('Where do I submit my final project?',
'Final project submission requires: 1) GitHub repo with all code 2) README with setup 3) 5-min demo video 4) Technical documentation 5) Deployed link (if applicable). Submit through Dashboard > Projects.',
'submission', ARRAY['project', 'submission', 'final'], 289, true),

('What is the deadline for project submission?',
'Final project deadline: Last Friday of program (check calendar). Late submissions: -10% per day, max 3 days late. Extension requests 48h before deadline with documented reason.',
'submission', ARRAY['deadline', 'submission', 'late'], 212, true),

-- Evaluations
('How is my final score calculated?',
'Score breakdown: Projects (40%), Assignments (20%), Course completion (15%), Attendance (10%), Peer reviews (10%), Mentor evaluation (5%). Minimum 60% for certificate, 90% for distinction.',
'evaluation', ARRAY['score', 'grading', 'criteria'], 234, true),

('Can I see my evaluation feedback?',
'Yes, detailed feedback is available 5 business days after final review. Includes code review comments, presentation notes, project rubric scores, and mentor overall comments.',
'evaluation', ARRAY['feedback', 'review', 'results'], 178, true),

-- Account Access
('I cannot login to my account. What do I do?',
'Try: 1) Reset password via Forgot Password 2) Check spam folder 3) Clear browser cache 4) Try different browser. If still failing, contact support with your registered email.',
'account', ARRAY['login', 'access', 'password'], 156, true),

('How do I reset my password?',
'Click Forgot Password on login page, enter your registered email, check inbox for reset link (valid 1 hour). For security, you cannot reuse last 3 passwords. Check spam if email not received.',
'account', ARRAY['password', 'reset', 'security'], 189, true),

-- AI Learning
('Are there beginner AI courses available?',
'Yes! AI Foundations track: Introduction to Machine Learning, Python for Data Science, Math for AI, Ethics and Bias. No prerequisites. Self-paced with mentor support.',
'ai-learning', ARRAY['beginner', 'courses', 'foundations'], 198, true),

('What AI tools will I learn?',
'Tools: Python ML stack (NumPy, Pandas, Scikit-learn), Deep learning (TensorFlow, PyTorch), NLP (Hugging Face, spaCy), Data visualization (Matplotlib, Plotly), Cloud ML (AWS SageMaker, Vertex AI).',
'ai-learning', ARRAY['tools', 'libraries', 'frameworks'], 167, true),

-- Collaboration
('How do I collaborate with international team members?',
'Use shared Slack channels, async tools (Loom for video updates, Notion for docs), and overlapping timezone hours for live meetings. Mentors help schedule meetings across timezones.',
'collaboration', ARRAY['international', 'team', 'timezone'], 145, true),

('What tools are provided for collaboration?',
'Provided accounts: Slack (team communication), Notion (documentation), Figma (design), GitHub (code), Zoom (meetings), Loom (async video). All accounts provisioned during onboarding week.',
'collaboration', ARRAY['tools', 'communication', 'accounts'], 178, true),

-- Troubleshooting
('My code is not working. How do I get help?',
'Resources: 1) Check LMS troubleshooting guide 2) Search Slack #help 3) Post question with code snippet in #tech-help 4) Book office hours 5) Message mentor. Response target: under 4 hours weekdays.',
'troubleshooting', ARRAY['help', 'debug', 'support'], 234, true),

('The LMS video is not playing. What should I do?',
'Try: 1) Refresh page 2) Clear browser cache 3) Disable ad blocker 4) Try different browser 5) Check internet speed. Use SD stream option if HD fails. Report persistent issues to tech support.',
'troubleshooting', ARRAY['video', 'lms', 'playback'], 189, true),

('I found a bug in the platform. Where do I report?',
'Report bugs via Dashboard > Help > Report Bug. Include: browser/device, steps to reproduce, screenshots, expected vs actual behavior. Critical bugs fixed within 48h.',
'troubleshooting', ARRAY['bug', 'report', 'platform'], 134, true);
