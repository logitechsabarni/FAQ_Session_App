/*
  # Seed Data for FAQ_Session Platform

  This migration adds sample FAQ data to demonstrate the platform functionality.

  1. Sample FAQs
    - Various categories represented
    - Questions about common topics
    - Tags for filtering
    - Different view counts for trending data

  Note: These FAQs are created without an author (created_by is NULL)
  to allow public viewing during initial demonstration.
*/

INSERT INTO faqs (question, description, category, tags, view_count, is_resolved) VALUES
  -- Technical FAQs
  (
    'How do I reset my password if I forgot it?',
    'I haven''t logged into my account in a while and I can''t remember my password. Is there a way to reset it? I''ve tried clicking "forgot password" but I''m not receiving the reset email.',
    'technical',
    ARRAY['password', 'account', 'security', 'login'],
    245,
    true
  ),
  (
    'Why is my application running slow?',
    'My application has been experiencing significant slowdowns over the past few days. Pages are taking 5-10 seconds to load and sometimes timeout completely. I''ve checked my internet connection and other websites work fine. What could be causing this and how can I troubleshoot it?',
    'technical',
    ARRAY['performance', 'optimization', 'troubleshooting'],
    189,
    false
  ),
  (
    'How do I integrate the API with my existing system?',
    'I have an existing application built with React and Node.js. I want to integrate the FAQ_Session API to display FAQs on my website. Can someone provide documentation or examples on how to get started?',
    'technical',
    ARRAY['api', 'integration', 'react', 'nodejs'],
    156,
    true
  ),

  -- Billing FAQs
  (
    'What payment methods do you accept?',
    'I''m trying to upgrade to a premium account but I want to know which payment methods are available before I proceed. Do you accept PayPal, credit cards, or bank transfers?',
    'billing',
    ARRAY['payment', 'pricing', 'upgrade'],
    134,
    true
  ),
  (
    'How do I cancel my subscription?',
    'I need to cancel my subscription but I can''t find the option in my account settings. Where is the cancel button located and will I receive a refund for the remaining days?',
    'billing',
    ARRAY['subscription', 'cancel', 'refund'],
    98,
    true
  ),
  (
    'Can I get an invoice for my purchase?',
    'I need an invoice for my company''s accounting department. How can I download or request an official invoice for my subscription payment?',
    'billing',
    ARRAY['invoice', 'receipt', 'business'],
    67,
    true
  ),

  -- Product FAQs
  (
    'What features are included in the premium plan?',
    'I''m considering upgrading from the free plan to premium but I want to understand exactly what additional features I''ll get. Can someone list all the premium features and how they compare to the free tier?',
    'product',
    ARRAY['features', 'premium', 'pricing', 'comparison'],
    312,
    false
  ),
  (
    'How do I export my data from the platform?',
    'I want to create a backup of all my FAQs and responses. Is there a way to export my data to a CSV or JSON file? I need to keep a local copy for compliance reasons.',
    'product',
    ARRAY['export', 'data', 'backup', 'download'],
    145,
    true
  ),
  (
    'Is there a mobile app available?',
    'I''d like to access the platform on my phone while on the go. Is there a mobile app for iOS or Android? If not, is the website mobile-friendly?',
    'product',
    ARRAY['mobile', 'app', 'ios', 'android'],
    203,
    false
  ),

  -- Support FAQs
  (
    'How do I contact customer support?',
    'I have an urgent issue that needs immediate attention. What''s the fastest way to get help? Is there live chat, email support, or a phone number I can call?',
    'support',
    ARRAY['contact', 'help', 'support', 'urgent'],
    178,
    true
  ),
  (
    'What are your business hours for support?',
    'I need to know when customer support is available. Are there specific hours or is support 24/7? I''m in a different timezone and want to know the best time to reach out.',
    'support',
    ARRAY['hours', 'timezone', 'availability', 'schedule'],
    89,
    true
  ),

  -- Feature Request FAQs
  (
    'Can we get a dark mode for the interface?',
    'It would be great to have a dark mode option for the interface. Many users prefer dark themes, especially when working late at night. This could help reduce eye strain and improve the overall user experience.',
    'feature',
    ARRAY['dark-mode', 'ui', 'ux', 'accessibility'],
    267,
    false
  ),
  (
    'Could you add markdown support for FAQ descriptions?',
    'I''d like to be able to format my questions and answers with markdown syntax. This would allow for better code snippets, lists, and emphasis in our technical discussions.',
    'feature',
    ARRAY['markdown', 'formatting', 'editor'],
    134,
    false
  ),

  -- Bug Report FAQs
  (
    'Getting error 500 when trying to post a reply',
    'Whenever I try to post a reply to any FAQ, I get an "Internal Server Error 500" message. I''ve tried refreshing the page, clearing my cache, and using a different browser but the issue persists. Has anyone else experienced this?',
    'bug',
    ARRAY['error', '500', 'reply', 'server'],
    156,
    true
  ),
  (
    'Images not loading on the profile page',
    'I uploaded a profile picture but it shows as broken on my profile page. The image preview worked fine during upload but now it just shows the default avatar. File size was under 2MB and it was a JPG format.',
    'bug',
    ARRAY['image', 'profile', 'upload', 'avatar'],
    78,
    false
  ),

  -- General FAQs
  (
    'What is FAQ_Session and how does it work?',
    'I just discovered this platform and I''m curious about its purpose. Can someone explain what FAQ_Session is, who it''s for, and how I can best utilize it for my needs?',
    'general',
    ARRAY['about', 'introduction', 'getting-started'],
    423,
    true
  ),
  (
    'How do I delete my account?',
    'I no longer want to use the platform and would like to permanently delete my account along with all my data. How can I do this and is there anything I should know before proceeding?',
    'general',
    ARRAY['account', 'delete', 'privacy', 'data'],
    234,
    true
  ),
  (
    'Is there a community forum or Discord server?',
    'I''d like to connect with other users outside of the FAQ platform. Is there an official community forum, Discord server, or social media group where users gather to discuss topics?',
    'general',
    ARRAY['community', 'discord', 'forum', 'social'],
    167,
    false
  ),

  -- More Technical FAQs
  (
    'How do I set up two-factor authentication?',
    'I want to add an extra layer of security to my account. Can someone walk me through the process of setting up two-factor authentication (2FA)? What authenticator apps are supported?',
    'technical',
    ARRAY['security', '2fa', 'authentication', 'setup'],
    198,
    true
  ),
  (
    'What browsers are supported?',
    'I''m having issues with the website in my browser. What are the officially supported browsers and versions? I want to make sure I''m using a compatible browser for the best experience.',
    'technical',
    ARRAY['browser', 'compatibility', 'supported'],
    112,
    true
  );
