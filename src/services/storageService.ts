import {
  Course,
  Instructor,
  LiveClass,
  LearningPath,
  Testimonial,
  FAQItem,
  HomepageSectionConfig,
  SiteSettings,
  Order,
  User,
  AuditLog,
  Certificate,
} from '@/types';

const STORAGE_KEYS = {
  COURSES: 'learninghub_courses_data',
  INSTRUCTORS: 'learninghub_instructors_data',
  LIVE_CLASSES: 'learninghub_live_classes_data',
  LEARNING_PATHS: 'learninghub_learning_paths_data',
  TESTIMONIALS: 'learninghub_testimonials_data',
  FAQS: 'learninghub_faqs_data',
  HOMEPAGE_SECTIONS: 'learninghub_sections_data',
  SETTINGS: 'learninghub_settings_data',
  ORDERS: 'learninghub_orders_data',
  CURRENT_USER: 'learninghub_current_user',
  AUDIT_LOGS: 'learninghub_audit_logs',
  CERTIFICATES: 'learninghub_certificates_data',
  INITIALIZED: 'learninghub_db_initialized_v2',
};

// Seed Instructors
const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Vikramaditya Sharma',
    title: {
      en: 'Principal Data Architect & Ex-Microsoft',
      hinglish: 'Principal Data Architect & Ex-Microsoft',
      hi: 'प्रधान डेटा आर्किटेक्ट एवं पूर्व-माइक्रोसॉफ्ट',
    },
    bio: {
      en: 'Over 14 years architecting petabyte-scale analytics and enterprise BI pipelines for Fortune 500 enterprises.',
      hinglish: '14+ saal ka enterprise analytics aur data modeling ka industry experience Fortune 500 companies ke sath.',
      hi: 'फॉर्च्यून 500 कंपनियों के लिए पेटाबाइट-स्केल एनालिटिक्स और एंटरप्राइज बीआई पाइपलाइन डिजाइन करने का 14 से अधिक वर्षों का अनुभव।',
    },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    company: 'Ex-Microsoft / Learning Hub Fellow',
    rating: 4.96,
    studentsCount: 38400,
    coursesCount: 3,
    socials: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  },
  {
    id: 'inst-2',
    name: 'Dr. Ananya Sen',
    title: {
      en: 'Head of AI Research & Ex-Google Lead',
      hinglish: 'Head of AI Research & Ex-Google Lead',
      hi: 'एआई रिसर्च प्रमुख एवं पूर्व-गूगल लीड',
    },
    bio: {
      en: 'PhD in Machine Learning. Pioneer in autonomous agent pipelines, vector databases, and Python data science.',
      hinglish: 'Machine learning PhD aur Google AI lead. Python, AI agents aur deep learning ke practical master.',
      hi: 'मशीन लर्निंग में पीएचडी। स्वायत्त एजेंट पाइपलाइन, वेक्टर डेटाबेस और पायथन डेटा साइंस में अग्रणी।',
    },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    company: 'Ex-Google AI / Senior Fellow',
    rating: 4.98,
    studentsCount: 42100,
    coursesCount: 4,
    socials: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
  },
  {
    id: 'inst-3',
    name: 'Rohan Deshmukh',
    title: {
      en: 'Senior VP of Financial Analytics',
      hinglish: 'Senior VP of Financial Analytics',
      hi: 'वरिष्ठ उपाध्यक्ष, वित्तीय विश्लेषण',
    },
    bio: {
      en: 'Former Goldman Sachs Quantitative Analyst. Built financial models for $10B+ sovereign wealth transactions.',
      hinglish: 'Goldman Sachs ex-quant analyst. Wall Street level Excel modeling aur valuation ke wizard.',
      hi: 'पूर्व गोल्डमैन सैक्स क्वांटिटेटिव विश्लेषक। $10B+ वित्तीय मॉडल तैयार किए।',
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    company: 'Ex-Goldman Sachs',
    rating: 4.92,
    studentsCount: 29500,
    coursesCount: 2,
    socials: { linkedin: 'https://linkedin.com' },
  },
];

// Seed Courses
const INITIAL_COURSES: Course[] = [
  {
    id: 'course-excel-mastery',
    slug: 'microsoft-excel-mastery-vba-automation',
    title: {
      en: 'Master Microsoft Excel: Advanced Formulas, Power Query & VBA',
      hinglish: 'Master Microsoft Excel: Advanced Formulas, Power Query aur VBA',
      hi: 'माइक्रोसॉफ्ट एक्सेल में महारत: उन्नत सूत्र, पावर क्वेरी एवं वीबीए',
    },
    shortDescription: {
      en: 'Go from Excel beginner to enterprise analyst with XLOOKUP, dynamic arrays, nested logic, Power Query automation, and custom VBA macros.',
      hinglish: 'Basic Excel se pro enterprise analyst bano. XLOOKUP, dynamic arrays, automated Power Query aur VBA macros step-by-step.',
      hi: 'एक्सेल शुरुआती से एंटरप्राइज विश्लेषक बनें। XLOOKUP, डायनामिक एरे, पावर क्वेरी ऑटोमेशन और कस्टम वीबीए मैक्रोज़ सीखें।',
    },
    longDescription: {
      en: 'Designed by former Wall Street quants and enterprise architects, this comprehensive masterclass unlocks the deepest capabilities of Microsoft Excel. You will work on live corporate balance sheets, automate multi-sheet data ingestion with Power Query, construct executive decision models, and write bulletproof VBA automation scripts.',
      hinglish: 'Wall Street quants aur Microsoft architects dwara banaya gaya ye course aapko corporate balance sheets, Power Query ingestion aur enterprise VBA automation me pro banata hai.',
      hi: 'पूर्व वॉल स्ट्रीट क्वांट्स और एंटरप्राइज आर्किटेक्ट्स द्वारा डिज़ाइन किया गया यह व्यापक मास्टरक्लास माइक्रोसॉफ्ट एक्सेल की गहनतम क्षमताओं को सिखाता है।',
    },
    category: 'Microsoft Excel',
    subcategory: 'Spreadsheet Engineering',
    level: 'All Levels',
    language: 'English + Hinglish',
    durationHours: 28,
    lessonsCount: 42,
    price: 3499,
    originalPrice: 8999,
    discountPercent: 61,
    rating: 4.94,
    reviewsCount: 3820,
    instructorId: 'inst-3',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    skills: ['Advanced Formulas', 'XLOOKUP & INDEX/MATCH', 'Power Query M Code', 'Pivot Tables & Slicers', 'VBA & Macro Scripting', 'Financial Modeling'],
    learningOutcomes: [
      {
        en: 'Master 75+ advanced Excel formulae including LAMBDA, LET, and dynamic array calculations',
        hinglish: '75+ advanced formulae jaise LAMBDA, LET aur dynamic arrays me master banenge',
        hi: 'LAMBDA, LET और डायनेमिक ऐरे गणनाओं सहित 75+ उन्नत एक्सेल सूत्रों में महारत हासिल करें',
      },
      {
        en: 'Automate messy CSV/SQL exports with Power Query ETL pipelines',
        hinglish: 'Messy data ko Power Query se automated ETL pipeline banakar clean karein',
        hi: 'पावर क्वेरी ईटीएल पाइपलाइन के साथ गंदे डेटा निर्यात को स्वचालित करें',
      },
      {
        en: 'Build self-updating executive C-suite dashboard interfaces',
        hinglish: 'Interactive C-suite executive dashboards design karein jo auto-refresh hote hain',
        hi: 'स्व-अद्यतनकारी कार्यकारी सी-सूट डैशबोर्ड इंटरफेस बनाएं',
      },
    ],
    requirements: [
      {
        en: 'A PC or Mac with Microsoft Excel 2019, 2021, or Microsoft 365',
        hinglish: 'Laptop ya PC jisme Microsoft Excel 2019/365 installed ho',
        hi: 'माइक्रोसॉफ्ट एक्सेल 2019, 2021 या 365 वाला पीसी या मैक',
      },
    ],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    updatedAt: '2026-08-15',
    modules: [
      {
        id: 'mod-1',
        title: {
          en: 'Foundation: Modern Dynamic Arrays & Modern Formulas',
          hinglish: 'Module 1: Dynamic Arrays aur Advanced Formulas',
          hi: 'मॉड्यूल 1: आधुनिक डायनामिक एरे और सूत्र',
        },
        order: 1,
        lessons: [
          {
            id: 'les-1-1',
            title: {
              en: 'Welcome & Enterprise Architecture Overview',
              hinglish: 'Welcome aur Course Roadmap Overview',
              hi: 'स्वागत एवं एंटरप्राइज आर्किटेक्चर अवलोकन',
            },
            description: {
              en: 'How modern Fortune 500 teams leverage Excel as an analytical powerhouse.',
              hinglish: 'Top companies Excel ko enterprise level par kaise utilize karti hain.',
              hi: 'आधुनिक कंपनियाँ एक्सेल का विश्लेषणात्मक उपयोग कैसे करती हैं।',
            },
            durationMinutes: 14,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            isFreePreview: true,
            order: 1,
            resources: [{ name: 'Syllabus-Overview.pdf', url: '#' }],
          },
          {
            id: 'les-1-2',
            title: {
              en: 'XLOOKUP, FILTER, UNIQUE & SORT Dynamic Arrays',
              hinglish: 'XLOOKUP, FILTER, UNIQUE aur SORT Formulae In-Depth',
              hi: 'XLOOKUP, FILTER, UNIQUE और SORT डायनामिक सूत्र',
            },
            description: {
              en: 'Replacing legacy VLOOKUP and building zero-drag lookup architectures.',
              hinglish: 'Purane VLOOKUP ko chhod kar high-speed lookups kaise banayein.',
              hi: 'पारंपरिक वीलुकअप को बदलना और शून्य-त्रुटि लुकअप बनाना।',
            },
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            isFreePreview: true,
            order: 2,
            resources: [{ name: 'DynamicArraysPractice.xlsx', url: '#' }],
          },
          {
            id: 'les-1-3',
            title: {
              en: 'LAMBDA & LET Functions: Reusable Function Engineering',
              hinglish: 'LAMBDA aur LET: Reusable custom functions likhein',
              hi: 'LAMBDA और LET फ़ंक्शंस: पुन: प्रयोज्य फ़ंक्शन निर्माण',
            },
            description: {
              en: 'Write custom modular functions directly in Excel formulas without VBA.',
              hinglish: 'Bina VBA ke clean modular formulas kaise banayein.',
              hi: 'बिना वीबीए के कस्टम मॉड्यूलर सूत्र बनाएं।',
            },
            durationMinutes: 32,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            isFreePreview: false,
            order: 3,
          },
        ],
      },
      {
        id: 'mod-2',
        title: {
          en: 'Power Query & Automated Data Cleansing Pipelines',
          hinglish: 'Module 2: Power Query ETL aur Data Cleaning',
          hi: 'मॉड्यूल 2: पावर क्वेरी और स्वचालित डेटा स्वच्छता',
        },
        order: 2,
        lessons: [
          {
            id: 'les-2-1',
            title: {
              en: 'Ingesting Multi-Million Row Datasets into Power Query',
              hinglish: 'Large Multi-File Datasets ko Power Query me lana',
              hi: 'पावर क्वेरी में बड़े डेटासेट लोड करना',
            },
            description: {
              en: 'Unpivot, split, join, and merge heterogeneous sources with zero code.',
              hinglish: 'Multiple excel files aur CSVs ko ek click me clean aur merge karein.',
              hi: 'अनेक स्रोतों को बिना कोड के जोड़ना और साफ करना।',
            },
            durationMinutes: 35,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            isFreePreview: false,
            order: 1,
          },
          {
            id: 'les-2-2',
            title: {
              en: 'Writing Custom M-Code Transforms for Automated Reporting',
              hinglish: 'M-Code Transformations likhna automated reporting ke liye',
              hi: 'स्वचालित रिपोर्टिंग के लिए कस्टम एम-कोड लिखना',
            },
            description: {
              en: 'Mastering the Power Query functional programming engine.',
              hinglish: 'Power Query ka internal M language use karke advanced rules lagayein.',
              hi: 'पावर क्वेरी कार्यात्मक प्रोग्रामिंग में महारत।',
            },
            durationMinutes: 40,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            isFreePreview: false,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'course-sql-analytics',
    slug: 'production-sql-for-data-analytics-warehousing',
    title: {
      en: 'Production SQL Mastery: CTEs, Window Functions & Warehousing',
      hinglish: 'Production SQL Mastery: CTEs, Window Functions aur Big Data',
      hi: 'प्रोडक्शन एसक्यूएल: सीटीई, विंडो फ़ंक्शंस एवं वेयरहाउसिंग',
    },
    shortDescription: {
      en: 'Master high-performance SQL querying with PostgreSQL & Snowflake: recursive CTEs, partitioning, complex aggregations, and query optimization.',
      hinglish: 'PostgreSQL aur Snowflake me production grade SQL queries likhein. Window functions, indexing, CTEs aur execution plan analysis.',
      hi: 'पोस्टग्रेएसक्यूएल और स्नोफ्लेक के साथ उच्च-प्रदर्शन एसक्यूएल: रिकर्सिव सीटीई, विंडो फ़ंक्शंस और क्वेरी अनुकूलन।',
    },
    longDescription: {
      en: 'Real analytical engineering requires more than SELECT * FROM table. In this course, analyze authentic e-commerce and fintech data schemas with millions of transactions. Master window functions (RANK, DENSE_RANK, LEAD, LAG, NTILE), design optimized star schemas, and diagnose slow queries with EXPLAIN ANALYZE.',
      hinglish: 'Basics se aage badhein. Millions of transactions wale databases par complex window functions, retention cohorts aur performance tuning seekhein.',
      hi: 'वास्तविक विश्लेषणात्मक इंजीनियरिंग के लिए तैयार हों। लाखों लेन-देन वाले ई-कॉमर्स और फिनटेक स्कीमा का विश्लेषण करें।',
    },
    category: 'SQL',
    subcategory: 'Database Engineering',
    level: 'Intermediate',
    language: 'English + Hinglish',
    durationHours: 32,
    lessonsCount: 48,
    price: 3999,
    originalPrice: 9999,
    discountPercent: 60,
    rating: 4.97,
    reviewsCount: 2940,
    instructorId: 'inst-1',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    skills: ['PostgreSQL & Snowflake', 'Window Functions', 'Recursive CTEs', 'Cohort & Retention Analysis', 'Query Plan Optimization', 'Data Warehousing'],
    learningOutcomes: [
      {
        en: 'Write bulletproof multi-stage Common Table Expressions (CTEs)',
        hinglish: 'Multi-stage complex CTEs aur recursive queries likhna seekhenge',
        hi: 'बहु-चरणीय सामान्य तालिका व्यंजक (सीटीई) लिखें',
      },
      {
        en: 'Calculate MoM, YoY, Rolling Averages, and Customer Cohort Retention in pure SQL',
        hinglish: 'MoM, YoY growth aur customer retention metrics pure SQL se nikalna',
        hi: 'शुद्ध एसक्यूएल में ग्राहक कोहोर्ट और विकास मेट्रिक्स की गणना करें',
      },
      {
        en: 'Debug 10x query bottlenecks using EXPLAIN ANALYZE and proper indexing',
        hinglish: 'Slow queries ko 10x fast banana EXPLAIN plans analyze karke',
        hi: 'क्वेरी प्रदर्शन बाधाओं को पहचानें और अनुक्रमणिका अनुकूलित करें',
      },
    ],
    requirements: [
      {
        en: 'Basic familiarity with tables and basic SELECT statements',
        hinglish: 'Basic computer skills aur database ka thoda sa idea',
        hi: 'तालिकाओं और बुनियादी सेलेक्ट कथनों से बुनियादी परिचय',
      },
    ],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    updatedAt: '2026-08-20',
    modules: [
      {
        id: 'mod-sql-1',
        title: {
          en: 'Advanced Joins & Analytical Set Theory',
          hinglish: 'Module 1: Advanced Joins aur Complex Relationships',
          hi: 'मॉड्यूल 1: उन्नत जॉइन्स और संबंध',
        },
        order: 1,
        lessons: [
          {
            id: 'les-sql-1-1',
            title: {
              en: 'Relational Schemas, Constraints & Foreign Key Internals',
              hinglish: 'Schema Architecture aur Foreign Key Realities',
              hi: 'रिलेशनल स्कीमा और फॉरेन की संरचना',
            },
            description: {
              en: 'Understand how PostgreSQL handles locks, pages, and indexes.',
              hinglish: 'PostgreSQL internal storage aur indexing ka complete blueprint.',
              hi: 'डेटाबेस लॉक्स और अनुक्रमणिका का आंतरिक कार्य।',
            },
            durationMinutes: 22,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            isFreePreview: true,
            order: 1,
          },
          {
            id: 'les-sql-1-2',
            title: {
              en: 'Window Functions: ROW_NUMBER, RANK, DENSE_RANK & PARTITION BY',
              hinglish: 'Window Functions: ROW_NUMBER, RANK aur PARTITION BY Deep Dive',
              hi: 'विंडो फ़ंक्शंस: रो_नंबर, रैंक एवं पार्टीशन बाय',
            },
            description: {
              en: 'The secret weapon of top-tier analytical engineers.',
              hinglish: 'Top data analysts ka sabse power weapon detail me.',
              hi: 'उन्नत डेटा विश्लेषकों का प्रमुख हथियार।',
            },
            durationMinutes: 38,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            isFreePreview: false,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'course-powerbi-dax',
    slug: 'enterprise-power-bi-dax-data-modeling',
    title: {
      en: 'Enterprise Power BI: Star Schemas, DAX & Executive Storytelling',
      hinglish: 'Enterprise Power BI: Star Schemas, DAX aur Interactive Dashboards',
      hi: 'एंटरप्राइज पावर बीआई: स्टार स्कीमा, डैक्स एवं डैशबोर्ड',
    },
    shortDescription: {
      en: 'Transform raw enterprise tables into breathtaking, lightning-fast Power BI dashboards with DAX CALCULATE, Time Intelligence, and semantic data models.',
      hinglish: 'Professional Power BI dashboards banayein. DAX CALCULATE, time intelligence functions aur beautiful UI storytelling.',
      hi: 'डैक्स कैलकुलेट और टाइम इंटेलिजेंस के साथ शानदार पावर बीआई डैशबोर्ड बनाएं।',
    },
    longDescription: {
      en: 'Learn how Fortune 100 leadership teams make billion-dollar decisions using Power BI. Master semantic dimensional modeling, handle many-to-many relationships without circular loops, build dynamic calculation groups, and deploy enterprise reports to Power BI Service with row-level security.',
      hinglish: 'Executive level Power BI dashboards design karein. Star schema modeling, DAX time intelligence aur Row-Level Security (RLS) step-by-step.',
      hi: 'एंटरप्राइज रिपोर्टिंग और सुरक्षित डेटा मॉडल के साथ पावर बीआई में संपूर्ण महारत।',
    },
    category: 'Power BI',
    subcategory: 'Business Intelligence',
    level: 'All Levels',
    language: 'English + Hinglish',
    durationHours: 26,
    lessonsCount: 36,
    price: 3499,
    originalPrice: 7999,
    discountPercent: 56,
    rating: 4.93,
    reviewsCount: 2410,
    instructorId: 'inst-1',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    skills: ['Star Schema Modeling', 'DAX CALCULATE', 'Time Intelligence', 'Row-Level Security (RLS)', 'Power BI Service', 'Custom Tooltips'],
    learningOutcomes: [
      {
        en: 'Architect clean Kimball star schemas with fact and dimension tables',
        hinglish: 'Clean Kimball star schemas aur dimensional modeling design karein',
        hi: 'स्वच्छ किमबॉल स्टार स्कीमा और आयामी मॉडल तैयार करें',
      },
      {
        en: 'Master DAX filter context transition, CALCULATE, and ALL/KEEPFILTERS',
        hinglish: 'DAX context transition aur advanced calculate logic me pro banein',
        hi: 'डैक्स फिल्टर संदर्भ संक्रमण और कैलकुलेट में महारत',
      },
    ],
    requirements: [
      {
        en: 'Free Power BI Desktop installed on Windows (or virtual machine)',
        hinglish: 'Power BI Desktop software installed hona chahiye',
        hi: 'विंडोज पर पावर बीआई डेस्कटॉप इंस्टॉल होना चाहिए',
      },
    ],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    updatedAt: '2026-08-25',
    modules: [
      {
        id: 'mod-pbi-1',
        title: {
          en: 'Architecting the Semantic Data Model',
          hinglish: 'Module 1: Semantic Data Modeling aur Star Schemas',
          hi: 'मॉड्यूल 1: सिमेंटिक डेटा मॉडल तैयार करना',
        },
        order: 1,
        lessons: [
          {
            id: 'les-pbi-1',
            title: {
              en: 'Star Schema vs Snowflake Schema in Real Enterprise Environments',
              hinglish: 'Star Schema vs Snowflake Schema Enterprise Comparison',
              hi: 'स्टार स्कीमा बनाम स्नोफ्लेक स्कीमा तुलना',
            },
            description: {
              en: 'Why 90% of slow Power BI reports are caused by bad relationships.',
              hinglish: 'Power BI reports slow kyu hoti hain aur model optimize kaise karein.',
              hi: 'डेटा मॉडल को गति प्रदान करने के नियम।',
            },
            durationMinutes: 26,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            isFreePreview: true,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'course-python-data-ai',
    slug: 'python-for-data-science-machine-learning-ai',
    title: {
      en: 'Python for Data Science, Automation & Machine Learning',
      hinglish: 'Python for Data Science, Automation aur AI Machine Learning',
      hi: 'डेटा साइंस, ऑटोमेशन एवं मशीन लर्निंग हेतु पायथन',
    },
    shortDescription: {
      en: 'From Python primitives to Pandas, NumPy, statistical modeling, predictive machine learning with Scikit-Learn, and building LLM agent tools.',
      hinglish: 'Python basic se shuru karke Pandas, NumPy, statistical analysis aur predictive ML models build karna seekhein.',
      hi: 'पायथन मूल सिद्धांतों से लेकर पांडा, न्यूमपाई, सांख्यिकीय मॉडलिंग और एआई एजेंट निर्माण।',
    },
    longDescription: {
      en: 'Taught by an ex-Google AI lead, this masterclass bridges the gap between pure programming and applied data intelligence. Write idiomatic vector operations, construct automated web scrapers, train classification and regression algorithms, and integrate modern generative AI APIs into data pipelines.',
      hinglish: 'Ex-Google AI lead se seekhein. Real-world datasets par Pandas, automated web scrapers, Scikit-learn models aur modern AI automation.',
      hi: 'वास्तविक दुनिया के डेटासेट पर पायथन, पांडा, मशीन लर्निंग और आधुनिक एआई ऑटोमेशन सीखें।',
    },
    category: 'Python',
    subcategory: 'AI & Data Science',
    level: 'All Levels',
    language: 'English + Hinglish',
    durationHours: 36,
    lessonsCount: 52,
    price: 4499,
    originalPrice: 11999,
    discountPercent: 62,
    rating: 4.98,
    reviewsCount: 4120,
    instructorId: 'inst-2',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    skills: ['Python 3.12', 'Pandas & NumPy', 'Data Visualization (Seaborn/Plotly)', 'Scikit-Learn ML', 'Web Scraping', 'AI Agent Workflows'],
    learningOutcomes: [
      {
        en: 'Manipulate multi-gigabyte DataFrames with vector speed',
        hinglish: 'Large multi-GB datasets ko Pandas vectorization se fast process karein',
        hi: 'पांडा वेक्टराइजेशन के साथ बड़े डेटासेट को तेजी से संसाधित करें',
      },
      {
        en: 'Deploy predictive machine learning models to production APIs',
        hinglish: 'Machine learning models ko train aur API me deploy karein',
        hi: 'उत्पादन एपीआई में भविष्य कहनेवाला मशीन लर्निंग मॉडल तैनात करें',
      },
    ],
    requirements: [
      {
        en: 'Any modern computer running Windows, macOS, or Linux',
        hinglish: 'Koi bhi computer ya laptop, basic curiosity',
        hi: 'विंडोज, मैकओएस या लिनक्स चलाने वाला कोई भी कंप्यूटर',
      },
    ],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    updatedAt: '2026-08-30',
    modules: [
      {
        id: 'mod-py-1',
        title: {
          en: 'Python Vector Foundations & Pandas Data Wrangling',
          hinglish: 'Module 1: Python Vector Foundations aur Pandas Mastery',
          hi: 'मॉड्यूल 1: पायथन वेक्टर आधार और पांडा डेटा व्यवस्थापन',
        },
        order: 1,
        lessons: [
          {
            id: 'les-py-1',
            title: {
              en: 'Setting Up Modern Jupyter, Conda & Environment Standards',
              hinglish: 'Professional Python Data Science Environment Setup',
              hi: 'पेशेवर पायथन डेटा साइंस वातावरण सेटअप',
            },
            description: {
              en: 'Industry tooling: VS Code, Conda environments, and JupyterLab.',
              hinglish: 'Data scientists ki tarah workspace setup karein.',
              hi: 'डेटा वैज्ञानिकों के लिए कार्यक्षेत्र सेटअप।',
            },
            durationMinutes: 19,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            isFreePreview: true,
            order: 1,
          },
        ],
      },
    ],
  },
];

// Seed Live Classes
const INITIAL_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live-excel-strategy',
    roomId: 'excel-live-890',
    title: {
      en: 'Executive Financial Dashboards & Macro Live Workshop',
      hinglish: 'Executive Financial Dashboards & Macro Live Workshop',
      hi: 'कार्यकारी वित्तीय डैशबोर्ड एवं मैक्रो लाइव कार्यशाला',
    },
    description: {
      en: 'Join Rohan Deshmukh live to construct a corporate quarterly boardroom dashboard from raw transaction logs. Two-way interactive Q&A.',
      hinglish: 'Rohan Deshmukh ke saath live judein. Live corporate dashboard banayein aur doubts pucho 2-way audio/video ke sath.',
      hi: 'रोहन देशमुख के साथ लाइव जुड़ें। कच्चे लेन-देन डेटा से कॉर्पोरेट बोर्डरूम डैशबोर्ड बनाएं।',
    },
    instructorId: 'inst-3',
    courseId: 'course-excel-mastery',
    scheduledStartTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes from now (or live)
    durationMinutes: 90,
    status: 'live',
    joinUrl: '/live/excel-live-890',
    maxParticipants: 200,
    currentParticipantsCount: 47,
    recordingAvailable: true,
  },
  {
    id: 'live-sql-warroom',
    roomId: 'sql-warroom-102',
    title: {
      en: 'Live SQL War Room: Diagnosing Million-Row Deadlocks & Latency',
      hinglish: 'Live SQL War Room: Slow Queries ko 10x Fast Karna',
      hi: 'लाइव एसक्यूएल वॉर रूम: डेटाबेस विलंबता निदान',
    },
    description: {
      en: 'Hands-on query execution plan surgery. Learn index rebuild strategies and recursive CTEs under high concurrent traffic.',
      hinglish: 'Vikramaditya Sharma ke sath live database queries optimize karein. Real-time coding.',
      hi: 'विक्रमादित्य शर्मा के साथ लाइव डेटाबेस क्वेरी अनुकूलन।',
    },
    instructorId: 'inst-1',
    courseId: 'course-sql-analytics',
    scheduledStartTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
    durationMinutes: 75,
    status: 'scheduled',
    joinUrl: '/live/sql-warroom-102',
    maxParticipants: 150,
    currentParticipantsCount: 88,
    recordingAvailable: true,
  },
  {
    id: 'live-ai-agents',
    roomId: 'ai-agents-504',
    title: {
      en: 'Autonomous AI Agents with Python & Function Calling',
      hinglish: 'Autonomous AI Agents: Python se Real Tools Build Karein',
      hi: 'पायथन एवं फंक्शन कॉलिंग के साथ स्वायत्त एआई एजेंट',
    },
    description: {
      en: 'Building tool-augmented reasoning workflows using Python and modern LLM APIs with Dr. Ananya Sen.',
      hinglish: 'Dr. Ananya Sen ke sath Python AI agents live code karein.',
      hi: 'डॉ. अनन्या सेन के साथ पायथन में एआई एजेंट बनाएं।',
    },
    instructorId: 'inst-2',
    courseId: 'course-python-data-ai',
    scheduledStartTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    durationMinutes: 90,
    status: 'scheduled',
    joinUrl: '/live/ai-agents-504',
    maxParticipants: 300,
    currentParticipantsCount: 142,
    recordingAvailable: true,
  },
];

// Seed Learning Paths
const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-data-analyst',
    slug: 'complete-data-analyst-career-track',
    title: {
      en: 'Complete Modern Data Analyst Career Track',
      hinglish: 'Complete Modern Data Analyst Career Track',
      hi: 'संपूर्ण आधुनिक डेटा विश्लेषक करियर ट्रैक',
    },
    description: {
      en: 'The definitive end-to-end curriculum: Master Excel automation, relational SQL querying, and executive Power BI storytelling.',
      hinglish: 'Excel, SQL aur Power BI ka complete 3-in-1 combo jo aapko top product companies me Data Analyst banata hai.',
      hi: 'एक्सेल, एसक्यूएल और पावर बीआई का संपूर्ण संयोजन जो आपको शीर्ष कंपनियों में डेटा विश्लेषक बनाता है।',
    },
    icon: 'BarChart3',
    courseIds: ['course-excel-mastery', 'course-sql-analytics', 'course-powerbi-dax'],
    estimatedWeeks: 12,
    level: 'Beginner to Advanced',
  },
  {
    id: 'path-ai-engineer',
    slug: 'data-science-ai-automation-architect',
    title: {
      en: 'Data Science & Generative AI Automation Architect',
      hinglish: 'Data Science & Generative AI Automation Track',
      hi: 'डेटा साइंस एवं जनरेटिव एआई ऑटोमेशन आर्किटेक्ट',
    },
    description: {
      en: 'From database engineering with SQL to Python algorithmic processing, statistical modeling, and autonomous agent orchestration.',
      hinglish: 'SQL se lekar Python machine learning aur AI agents tak ka comprehensive pathway.',
      hi: 'एसक्यूएल डेटाबेस से लेकर पायथन मशीन लर्निंग और एआई एजेंट तक का व्यापक मार्ग।',
    },
    icon: 'Cpu',
    courseIds: ['course-sql-analytics', 'course-python-data-ai'],
    estimatedWeeks: 16,
    level: 'Intermediate to Advanced',
  },
];

// Seed Testimonials
const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Pooja Kashyap',
    role: 'Senior Data Analyst',
    company: 'Amazon Web Services',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    courseName: 'Production SQL Mastery',
    order: 1,
    content: {
      en: 'The depth on SQL CTEs and query planning is unlike anything I found on YouTube or Udemy. It directly helped me pass AWS technical screens and secure a 40% salary hike.',
      hinglish: 'Is platform ka content ultra-practical hai! Window functions aur indexing ki wajah se mujhe AWS me senior role mila.',
      hi: 'एसक्यूएल सीटीई और क्वेरी प्लानिंग पर गहराई असाधारण है। इसने मुझे सीधे एडब्ल्यूएस तकनीकी साक्षात्कार पास करने में मदद की।',
    },
  },
  {
    id: 'test-2',
    name: 'Rahul Verma',
    role: 'Lead BI Architect',
    company: 'Deloitte Consulting',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    courseName: 'Enterprise Power BI & DAX',
    order: 2,
    content: {
      en: 'The live classes where mentors debug real data problems on their screen are invaluable. You feel like you are sitting right beside a principal engineer.',
      hinglish: 'Live classes me mentors ke sath directly interact karna game-changer raha. Concepts crystal clear ho gaye.',
      hi: 'लाइव कक्षाएं जहां मेंटर्स स्क्रीन पर वास्तविक समस्याओं का समाधान करते हैं, अमूल्य हैं।',
    },
  },
  {
    id: 'test-3',
    name: 'Siddharth Nair',
    role: 'Financial Systems Manager',
    company: 'KPMG Advisory',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    courseName: 'Master Microsoft Excel & VBA',
    order: 3,
    content: {
      en: 'Automated 15 hours of repetitive weekly auditing tasks with the Power Query and VBA methods taught in the first 3 modules alone.',
      hinglish: 'Sirf pehle 3 modules dekh kar maine apne weekly 15 ghante ke manual Excel tasks ko fully automate kar diya.',
      hi: 'केवल पहले 3 मॉड्यूल के पावर क्वेरी और वीबीए तरीकों से मैंने अपने साप्ताहिक 15 घंटे के काम को स्वचालित कर दिया।',
    },
  },
];

// Seed FAQs
const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: {
      en: 'How do the live classes work? Do I need special software?',
      hinglish: 'Live classes kaise conduct hoti hain? Kya koi alag app chahiye?',
      hi: 'लाइव कक्षाएं कैसे काम करती हैं? क्या मुझे विशेष सॉफ्टवेयर की आवश्यकता है?',
    },
    answer: {
      en: 'Our live classes run directly inside your browser using ultra-low latency WebRTC. You can join directly from your dashboard or join link with full two-way camera, microphone, screen-sharing, and interactive chat—no external software downloads required.',
      hinglish: 'Aap directly browser se join kar sakte hain. Camera, mic aur screen share ke saath 2-way live interaction hota hai.',
      hi: 'हमारी लाइव कक्षाएं ब्राउज़र में सीधे चलती हैं। आप कैमरा, माइक और स्क्रीन शेयरिंग के साथ सीधे जुड़ सकते हैं।',
    },
  },
  {
    id: 'faq-2',
    question: {
      en: 'Do I receive a verified certificate upon completion?',
      hinglish: 'Kya course complete hone par verified certificate milta hai?',
      hi: 'क्या मुझे पूर्णता पर सत्यापित प्रमाणपत्र प्राप्त होगा?',
    },
    answer: {
      en: 'Yes! Every course includes a cryptographically verifiable digital certificate with a unique certificate ID and QR code that can be shared on LinkedIn or verified by recruiters.',
      hinglish: 'Haan! Har course me unique QR code aur verification link ke sath verified certificate milta hai jise aap LinkedIn par add kar sakte hain.',
      hi: 'हाँ! प्रत्येक पाठ्यक्रम में एक अद्वितीय प्रमाणपत्र आईडी और क्यूआर कोड के साथ सत्यापन योग्य डिजिटल प्रमाणपत्र शामिल है।',
    },
  },
  {
    id: 'faq-3',
    question: {
      en: 'Is there lifetime access to videos and downloadable files?',
      hinglish: 'Kya video lectures aur files ka lifetime access milega?',
      hi: 'क्या वीडियो और डाउनलोड करने योग्य फाइलों तक आजीवन पहुंच है?',
    },
    answer: {
      en: 'Absolutely. Once enrolled, you retain 24/7 unlimited lifetime access to all recorded video lessons, practice workbooks, starter code repositories, and future curriculum updates.',
      hinglish: 'Haan, ek baar enroll karne ke baad aapko sabhi videos, Excel datasets aur future updates ka lifetime access milta hai.',
      hi: 'बिल्कुल। नामांकित होने के बाद, आप सभी रिकॉर्ड किए गए वीडियो और कार्यपुस्तिकाओं तक 24/7 आजीवन पहुंच बनाए रखते हैं।',
    },
  },
  {
    id: 'faq-4',
    question: {
      en: 'What if I miss a live class session?',
      hinglish: 'Agar meri live class miss ho gayi to kya hoga?',
      hi: 'यदि मेरी कोई लाइव कक्षा छूट जाए तो क्या होगा?',
    },
    answer: {
      en: 'All live classes are recorded in HD quality and automatically uploaded to your student dashboard within 4 hours along with the chat transcript and project files.',
      hinglish: 'Sabhi live sessions record hote hain aur class ke baad 4 ghante me aapke dashboard me HD recording add ho jaati hai.',
      hi: 'सभी लाइव कक्षाएं रिकॉर्ड की जाती हैं और 4 घंटे के भीतर आपके छात्र डैशबोर्ड पर जोड़ दी जाती हैं।',
    },
  },
];

// Seed Homepage Sections Config
const INITIAL_SECTIONS: HomepageSectionConfig[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: {
      en: 'Master High-Income Tech & Data Skills',
      hinglish: 'Seekho High-Income Tech & Data Skills',
      hi: 'उच्च आय वाले टेक एवं डेटा कौशल सीखें',
    },
    subtitle: {
      en: 'Production-ready curriculum in Excel, Power BI, SQL, Python, and AI with live interactive masterclasses.',
      hinglish: 'Excel, Power BI, SQL, Python aur AI me practical masterclasses live classes ke saath.',
      hi: 'एक्सेल, पावर बीआई, एसक्यूएल, पायथन और एआई में व्यावहारिक पाठ्यक्रम।',
    },
    isVisible: true,
    order: 1,
    primaryButtonText: { en: 'Explore Courses', hinglish: 'Courses Dekhein', hi: 'पाठ्यक्रम देखें' },
    primaryButtonUrl: '#courses',
    secondaryButtonText: { en: 'Join Live Class', hinglish: 'Live Class Join Karein', hi: 'लाइव कक्षा में शामिल हों' },
    secondaryButtonUrl: '#live',
  },
  {
    id: 'sec-stats',
    type: 'stats',
    title: { en: 'Trusted by 50,000+ Learners Worldwide', hinglish: '50,000+ Students Ka Vishwas', hi: '50,000+ शिक्षार्थियों का विश्वास' },
    subtitle: { en: 'Empowering professionals across top tech & finance companies', hinglish: 'Top companies me working professionals', hi: 'शीर्ष तकनीकी कंपनियों में कार्यरत पेशेवर' },
    isVisible: true,
    order: 2,
  },
  {
    id: 'sec-categories',
    type: 'categories',
    title: { en: 'Explore High-Demand Categories', hinglish: 'Top Categories Chunein', hi: 'उच्च मांग वाली श्रेणियां खोजें' },
    subtitle: { en: 'Master technologies that enterprise teams hire for every single day', hinglish: 'Wo skills jinki market me sabse jyada demand hai', hi: 'वे तकनीकें जिन्हें कंपनियां दैनिक आधार पर नियुक्त करती हैं' },
    isVisible: true,
    order: 3,
  },
  {
    id: 'sec-featured',
    type: 'featured_courses',
    title: { en: 'Flagship Masterclasses', hinglish: 'Popular Flagship Courses', hi: 'प्रमुख मास्टरक्लास' },
    subtitle: { en: 'Comprehensive industry-standard training with verifiable credentials', hinglish: 'Career-defining programs lifetime access ke sath', hi: 'सत्यापन योग्य क्रेडेंशियल के साथ व्यापक प्रशिक्षण' },
    isVisible: true,
    order: 4,
  },
  {
    id: 'sec-learning-paths',
    type: 'learning_paths',
    title: { en: 'Guided Career Roadmaps', hinglish: 'Guided Career Roadmaps', hi: 'मार्गदर्शित करियर रोडमैप' },
    subtitle: { en: 'Follow proven sequential curricula to transition into high-paying analyst and engineering roles', hinglish: 'Step-by-step roadmap zero se hero banne ke liye', hi: 'उच्च वेतन वाली विश्लेषक भूमिकाओं में संक्रमण के लिए चरणबद्ध खाका' },
    isVisible: true,
    order: 5,
  },
  {
    id: 'sec-live',
    type: 'live_classes',
    title: { en: 'Interactive Live Virtual Classrooms', hinglish: 'Interactive Live Virtual Classrooms', hi: 'इंटरएक्टिव लाइव वर्चुअल कक्षाएं' },
    subtitle: { en: 'Engage in two-way audio & video sessions with industry leads. Ask questions in real time.', hinglish: 'Mentors ke sath directly 2-way live video classes aur live doubts.', hi: 'उद्योग प्रमुखों के साथ दो-तरफ़ा ऑडियो और वीडियो सत्र।' },
    isVisible: true,
    order: 6,
  },
  {
    id: 'sec-why-us',
    type: 'why_us',
    title: { en: 'Why Learn on Learning Hub?', hinglish: 'Learning Hub Par Kyu Seekhein?', hi: 'Learning Hub पर क्यों सीखें?' },
    subtitle: { en: 'Engineered for depth, craftsmanship, and tangible career outcomes', hinglish: 'Real projects aur true mentorship ka perfect combination', hi: 'गहनता, शिल्प कौशल और ठोस करियर परिणामों के लिए निर्मित' },
    isVisible: true,
    order: 7,
  },
  {
    id: 'sec-testimonials',
    type: 'testimonials',
    title: { en: 'Proven Student Transformations', hinglish: 'Humaare Students Ke Transformations', hi: 'छात्रों के सफल अनुभव' },
    subtitle: { en: 'Real stories from professionals who accelerated their career trajectory', hinglish: 'Dekhein graduates ne kaise packages secure kiye', hi: 'पेशेवरों की वास्तविक कहानियां जिन्होंने अपने करियर को गति दी' },
    isVisible: true,
    order: 8,
  },
  {
    id: 'sec-instructors',
    type: 'instructors',
    title: { en: 'Learn from Industry Titans', hinglish: 'Industry Mentors Se Seekhein', hi: 'उद्योग के विशेषज्ञों से सीखें' },
    subtitle: { en: 'Our instructors have architected systems at Google, Microsoft, and Goldman Sachs', hinglish: 'Top companies me kaam kar chuke mentors', hi: 'हमारे प्रशिक्षकों ने गूगल, माइक्रोसॉफ्ट में सिस्टम डिजाइन किए हैं' },
    isVisible: true,
    order: 9,
  },
  {
    id: 'sec-faq',
    type: 'faq',
    title: { en: 'Frequently Asked Questions', hinglish: 'Aksar Puche Gaye Sawaal', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
    subtitle: { en: 'Everything you need to know about enrollments, live rooms, and certificates', hinglish: 'Enrollment aur platform ke baare me sab kuch', hi: 'नामांकन और प्रमाणपत्रों के बारे में पूरी जानकारी' },
    isVisible: true,
    order: 10,
  },
  {
    id: 'sec-cta',
    type: 'final_cta',
    title: { en: 'Ready to Accelerate Your Career?', hinglish: 'Apna Career Transform Karne Ke Liye Ready Ho?', hi: 'क्या आप अपने करियर को गति देने के लिए तैयार हैं?' },
    subtitle: { en: 'Join 50,000+ ambitious learners leveling up their technical edge today.', hinglish: 'Aaj hi start karein aur unlimited access paayein.', hi: 'आज ही जुड़ें और अपनी तकनीकी बढ़त को मजबूत करें।' },
    isVisible: true,
    order: 11,
    primaryButtonText: { en: 'Get Started Now', hinglish: 'Abhi Shuru Karein', hi: 'अभी शुरू करें' },
    primaryButtonUrl: '#courses',
  },
];

// Seed Site Settings
const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'Learning Hub',
  tagline: {
    en: 'Next-Gen Cinematic 3D EdTech Platform',
    hinglish: 'Next-Gen 3D Interactive Learning Platform',
    hi: 'नेक्स्ट-जेन 3D इंटरएक्टिव शिक्षा मंच',
  },
  logoText: 'Learning Hub',
  supportEmail: 'admissions@learninghub.io',
  supportPhone: '+1 (800) 555-DATA',
  currencySymbol: '₹',
  currencyCode: 'INR',
  liveClassProvider: 'LiveKit WebRTC SFU',
  paymentProvider: 'Razorpay / Stripe Gateway',
  videoProvider: 'Cloudflare Stream & Mux',
  announcementBar: {
    enabled: true,
    text: {
      en: '🔥 Monsoon Masterclass Sale: Use code PRO50 for 50% discount on all courses!',
      hinglish: '🔥 Limited Time Offer: Code PRO50 use karein aur 50% extra discount paayein!',
      hi: '🔥 सीमित समय का ऑफर: सभी पाठ्यक्रमों पर 50% छूट के लिए कोड PRO50 का उपयोग करें!',
    },
    linkText: {
      en: 'Claim Discount',
      hinglish: 'Offer Paayein',
      hi: 'छूट प्राप्त करें',
    },
    linkUrl: '#courses',
  },
};

// Seed Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    studentId: 'usr-student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@example.com',
    courseId: 'course-excel-mastery',
    courseTitle: 'Master Microsoft Excel: Advanced Formulas, Power Query & VBA',
    amount: 3499,
    discount: 5500,
    paymentStatus: 'paid',
    paymentProvider: 'Razorpay',
    transactionRef: 'pay_N7hG92K4Lm01',
    date: '2026-09-12 14:32',
  },
  {
    id: 'ORD-8922',
    studentId: 'usr-student-2',
    studentName: 'Neha Kapoor',
    studentEmail: 'neha.kapoor@example.com',
    courseId: 'course-sql-analytics',
    courseTitle: 'Production SQL Mastery: CTEs, Window Functions & Warehousing',
    amount: 3999,
    discount: 6000,
    paymentStatus: 'paid',
    paymentProvider: 'UPI',
    transactionRef: 'upi_98124018247@okaxis',
    date: '2026-09-13 09:15',
  },
  {
    id: 'ORD-8923',
    studentId: 'usr-student-3',
    studentName: 'Tanvi Joshi',
    studentEmail: 'tanvi.j@example.com',
    courseId: 'course-powerbi-dax',
    courseTitle: 'Enterprise Power BI: Star Schemas, DAX & Executive Storytelling',
    amount: 3499,
    discount: 4500,
    paymentStatus: 'paid',
    paymentProvider: 'Stripe',
    transactionRef: 'ch_3N8jY2KpLm90',
    date: '2026-09-13 18:40',
  },
  {
    id: 'ORD-8924',
    studentId: 'usr-student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@example.com',
    courseId: 'course-python-data-ai',
    courseTitle: 'Python for Data Science, Automation & Machine Learning',
    amount: 4499,
    discount: 7500,
    paymentStatus: 'paid',
    paymentProvider: 'Razorpay',
    transactionRef: 'pay_N8kL992Qx11',
    date: '2026-09-14 00:20',
  },
];

// Seed Certificates
const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'CERT-SF-2026-9041',
    studentId: 'usr-student-1',
    studentName: 'Aarav Sharma',
    courseId: 'course-excel-mastery',
    courseTitle: 'Master Microsoft Excel: Advanced Formulas, Power Query & VBA',
    instructorName: 'Rohan Deshmukh',
    completionDate: '2026-09-10',
    grade: 'Exemplary (98%)',
    qrVerificationUrl: 'https://learninghub.io/verify/CERT-SF-2026-9041',
  },
];

// Seed Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminEmail: 'admin@learninghub.io',
    action: 'PUBLISH_COURSE',
    resource: 'course-excel-mastery',
    details: 'Course published to production catalog with updated discount rate.',
    timestamp: '2026-09-12 11:20:00',
  },
  {
    id: 'log-2',
    adminEmail: 'admin@learninghub.io',
    action: 'CREATE_LIVE_CLASS',
    resource: 'live-excel-strategy',
    details: 'Generated secure room ID excel-live-890 with WebRTC SFU endpoint.',
    timestamp: '2026-09-13 08:45:00',
  },
];

// Seed Current User (Student with default enrollments)
const INITIAL_STUDENT_USER: User = {
  id: 'usr-student-1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  enrolledCourseIds: ['course-excel-mastery', 'course-sql-analytics'],
  completedLessonIds: ['les-1-1', 'les-1-2'],
  createdAt: '2026-08-01',
};

// Storage Service Singleton
export class StorageService {
  static initDatabase() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
      localStorage.setItem(STORAGE_KEYS.INSTRUCTORS, JSON.stringify(INITIAL_INSTRUCTORS));
      localStorage.setItem(STORAGE_KEYS.LIVE_CLASSES, JSON.stringify(INITIAL_LIVE_CLASSES));
      localStorage.setItem(STORAGE_KEYS.LEARNING_PATHS, JSON.stringify(INITIAL_LEARNING_PATHS));
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
      localStorage.setItem(STORAGE_KEYS.HOMEPAGE_SECTIONS, JSON.stringify(INITIAL_SECTIONS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_STUDENT_USER));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // Courses
  static getCourses(): Course[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      return data ? JSON.parse(data) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  }

  static getCourseBySlug(slug: string): Course | undefined {
    return this.getCourses().find((c) => c.slug === slug || c.id === slug);
  }

  static saveCourse(course: Course): Course {
    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === course.id);
    if (index >= 0) {
      courses[index] = { ...course, updatedAt: new Date().toISOString() };
    } else {
      courses.unshift({ ...course, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.addAuditLog('SAVE_COURSE', course.id, `Saved course: ${course.title.en}`);
    return course;
  }

  static deleteCourse(courseId: string) {
    const courses = this.getCourses().filter((c) => c.id !== courseId);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.addAuditLog('DELETE_COURSE', courseId, `Deleted course ${courseId}`);
  }

  // Instructors
  static getInstructors(): Instructor[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INSTRUCTORS);
      return data ? JSON.parse(data) : INITIAL_INSTRUCTORS;
    } catch {
      return INITIAL_INSTRUCTORS;
    }
  }

  static saveInstructor(instructor: Instructor) {
    const instructors = this.getInstructors();
    const index = instructors.findIndex((i) => i.id === instructor.id);
    if (index >= 0) {
      instructors[index] = instructor;
    } else {
      instructors.push(instructor);
    }
    localStorage.setItem(STORAGE_KEYS.INSTRUCTORS, JSON.stringify(instructors));
    this.addAuditLog('SAVE_INSTRUCTOR', instructor.id, `Saved instructor ${instructor.name}`);
  }

  // Live Classes
  static getLiveClasses(): LiveClass[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIVE_CLASSES);
      return data ? JSON.parse(data) : INITIAL_LIVE_CLASSES;
    } catch {
      return INITIAL_LIVE_CLASSES;
    }
  }

  static getLiveClassByRoomId(roomId: string): LiveClass | undefined {
    return this.getLiveClasses().find((c) => c.roomId === roomId || c.id === roomId);
  }

  static saveLiveClass(liveClass: LiveClass): LiveClass {
    const classes = this.getLiveClasses();
    const index = classes.findIndex((c) => c.id === liveClass.id);
    if (index >= 0) {
      classes[index] = liveClass;
    } else {
      classes.unshift(liveClass);
    }
    localStorage.setItem(STORAGE_KEYS.LIVE_CLASSES, JSON.stringify(classes));
    this.addAuditLog('SAVE_LIVE_CLASS', liveClass.id, `Saved live class: ${liveClass.title.en}`);
    return liveClass;
  }

  static updateLiveClassStatus(classId: string, status: LiveClass['status']): boolean {
    const classes = this.getLiveClasses();
    const target = classes.find((c) => c.id === classId || c.roomId === classId);
    if (target) {
      target.status = status;
      localStorage.setItem(STORAGE_KEYS.LIVE_CLASSES, JSON.stringify(classes));
      this.addAuditLog('UPDATE_CLASS_STATUS', classId, `Status changed to ${status}`);
      return true;
    }
    return false;
  }

  // Learning Paths
  static getLearningPaths(): LearningPath[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNING_PATHS);
      return data ? JSON.parse(data) : INITIAL_LEARNING_PATHS;
    } catch {
      return INITIAL_LEARNING_PATHS;
    }
  }

  // Testimonials
  static getTestimonials(): Testimonial[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return data ? JSON.parse(data) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  }

  // FAQs
  static getFaqs(): FAQItem[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAQS);
      return data ? JSON.parse(data) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  }

  // Homepage Sections (CMS Builder)
  static getSections(): HomepageSectionConfig[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HOMEPAGE_SECTIONS);
      const list: HomepageSectionConfig[] = data ? JSON.parse(data) : INITIAL_SECTIONS;
      return list.sort((a, b) => a.order - b.order);
    } catch {
      return INITIAL_SECTIONS;
    }
  }

  static saveSections(sections: HomepageSectionConfig[]) {
    localStorage.setItem(STORAGE_KEYS.HOMEPAGE_SECTIONS, JSON.stringify(sections));
    this.addAuditLog('UPDATE_HOMEPAGE_CMS', 'homepage', 'Saved section configurations and ordering');
  }

  // Settings
  static getSettings(): SiteSettings {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  static saveSettings(settings: SiteSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.addAuditLog('UPDATE_SETTINGS', 'system', 'Updated site branding and provider settings');
  }

  // Orders
  static getOrders(): Order[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  }

  static createOrder(order: Order): Order {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Also enroll user automatically if studentId matches current user
    const user = this.getCurrentUser();
    if (user && user.id === order.studentId) {
      if (!user.enrolledCourseIds.includes(order.courseId)) {
        user.enrolledCourseIds.push(order.courseId);
        this.saveCurrentUser(user);
      }
    }

    this.addAuditLog('CREATE_ORDER', order.id, `Created order ${order.id} for course ${order.courseTitle}`);
    return order;
  }

  // Certificates
  static getCertificates(): Certificate[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      return data ? JSON.parse(data) : INITIAL_CERTIFICATES;
    } catch {
      return INITIAL_CERTIFICATES;
    }
  }

  static getCertificateById(id: string): Certificate | undefined {
    return this.getCertificates().find((c) => c.id === id);
  }

  static awardCertificate(cert: Certificate): Certificate {
    const certs = this.getCertificates();
    certs.unshift(cert);
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs));
    this.addAuditLog('AWARD_CERTIFICATE', cert.id, `Awarded certificate to ${cert.studentName}`);
    return cert;
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  static addAuditLog(action: string, resource: string, details: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminEmail: 'admin@learninghub.io',
      action,
      resource,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    logs.unshift(newLog);
    // Keep last 100
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  }

  // Current User
  static getCurrentUser(): User {
    if (typeof window === 'undefined') return INITIAL_STUDENT_USER;
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : INITIAL_STUDENT_USER;
    } catch {
      return INITIAL_STUDENT_USER;
    }
  }

  static saveCurrentUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static toggleLessonComplete(courseId: string, lessonId: string): boolean {
    const user = this.getCurrentUser();
    const isCompleted = user.completedLessonIds.includes(lessonId);
    if (isCompleted) {
      user.completedLessonIds = user.completedLessonIds.filter((id) => id !== lessonId);
    } else {
      user.completedLessonIds.push(lessonId);
    }
    this.saveCurrentUser(user);

    // Check if whole course completed and generate certificate if not already created
    const course = this.getCourses().find((c) => c.id === courseId);
    if (course) {
      const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const allDone = allLessonIds.every((id) => user.completedLessonIds.includes(id));
      if (allDone) {
        const certExists = this.getCertificates().some(
          (c) => c.studentId === user.id && c.courseId === course.id
        );
        if (!certExists) {
          const cert: Certificate = {
            id: `CERT-SF-${Date.now().toString().slice(-6)}`,
            studentId: user.id,
            studentName: user.name,
            courseId: course.id,
            courseTitle: course.title.en,
            instructorName: 'Learning Hub Faculty',
            completionDate: new Date().toISOString().split('T')[0],
            grade: 'Distinction (96%)',
            qrVerificationUrl: `https://learninghub.io/verify/CERT-SF-${Date.now().toString().slice(-6)}`,
          };
          this.awardCertificate(cert);
        }
      }
    }

    return !isCompleted;
  }

  // Aliases and Administrative CMS Helpers
  static getSiteSettings(): any {
    return this.getSettings();
  }

  static saveSiteSettings(settings: any) {
    this.saveSettings(settings);
  }

  static getHomepageSections(): HomepageSectionConfig[] {
    return this.getSections();
  }

  static saveHomepageSections(sections: HomepageSectionConfig[]) {
    this.saveSections(sections);
  }

  static toggleCoursePublish(courseId: string): Course | undefined {
    const courses = this.getCourses();
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      course.status = course.status === 'published' ? 'draft' : 'published';
      course.updatedAt = new Date().toISOString();
      this.saveCourse(course);
      return course;
    }
    return undefined;
  }

  static logAuditAction(adminEmail: string, action: string, details: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminEmail,
      action,
      resource: 'admin-cms',
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  }

  static issueCertificate(cert: Certificate) {
    return this.awardCertificate(cert);
  }

  static createLiveClass(liveClass: LiveClass) {
    return this.saveLiveClass(liveClass);
  }
}
