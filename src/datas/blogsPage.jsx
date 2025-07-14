export const blogs = [
    {
        id: 1,
        title: 'My Journey from CIHS to Silicon Valley',
        author: 'Ahmed Rahman',
        authorImage: '/images/alumni/ahmed-rahman.jpg',
        date: 'November 20, 2024',
        category: 'Career',
        excerpt: 'How the foundation laid at CIHS helped me succeed in the tech industry. From learning problem-solving skills to building lasting friendships...',
        image: '/images/blogs/silicon-valley-journey.jpg',
        readTime: '5 min read',
        tags: ['Career', 'Technology', 'Success']
    },
    {
        id: 2,
        title: 'Memories of Golden Days at CIHS',
        author: 'Nasir Uddin',
        authorImage: '/images/alumni/nasir-uddin.jpg',
        date: 'November 15, 2024',
        category: 'Memories',
        excerpt: 'Nostalgic memories of school days and the teachers who shaped our lives. The corridors, the classrooms, and the friendships that lasted a lifetime...',
        image: '/images/blogs/golden-memories.jpg',
        readTime: '4 min read',
        tags: ['Memories', 'School Life', 'Nostalgia']
    },
    {
        id: 3,
        title: 'Building a Startup: Lessons from CIHS',
        author: 'Fatima Sheikh',
        authorImage: '/images/alumni/fatima-sheikh.jpg',
        date: 'November 10, 2024',
        category: 'Business',
        excerpt: 'How the entrepreneurial spirit was nurtured during my time at CIHS. The leadership qualities and teamwork skills I developed...',
        image: '/images/blogs/startup-lessons.jpg',
        readTime: '6 min read',
        tags: ['Business', 'Entrepreneurship', 'Leadership']
    },
    {
        id: 4,
        title: 'From CIHS to Harvard: An Academic Journey',
        author: 'Dr. Salma Khan',
        authorImage: '/images/alumni/salma-khan.jpg',
        date: 'November 5, 2024',
        category: 'Education',
        excerpt: 'The academic excellence culture at CIHS prepared me for the challenges of higher education at world&apos;s top universities...',
        image: '/images/blogs/harvard-journey.jpg',
        readTime: '7 min read',
        tags: ['Education', 'Academic', 'University']
    },
    {
        id: 5,
        title: 'Giving Back to Our Alma Mater',
        author: 'Mohammad Ali',
        authorImage: '/images/alumni/mohammad-ali.jpg',
        date: 'October 30, 2024',
        category: 'Community',
        excerpt: 'Why I decided to establish a scholarship fund for current CIHS students and how other alumni can contribute to our school&apos;s growth...',
        image: '/images/blogs/giving-back.jpg',
        readTime: '5 min read',
        tags: ['Community', 'Giving Back', 'Scholarship']
    },
    {
        id: 6,
        title: 'CIHS Teachers Who Changed My Life',
        author: 'Rashida Begum',
        authorImage: '/images/alumni/rashida-begum.jpg',
        date: 'October 25, 2024',
        category: 'Memories',
        excerpt: 'A tribute to the dedicated teachers at CIHS who went beyond academics to shape our character and values...',
        image: '/images/blogs/inspiring-teachers.jpg',
        readTime: '4 min read',
        tags: ['Teachers', 'Inspiration', 'Gratitude']
    }
]

export const categories = ['all', 'Career', 'Memories', 'Business', 'Education', 'Community']

export const blog = {
    id: 1,
    title: 'My Journey from CIHS to Silicon Valley',
    content: `
            <p>Starting my journey at Chittagong Ideal High School was the foundation that would eventually lead me to Silicon Valley. The rigorous academic environment and the emphasis on critical thinking at CIHS prepared me for the challenges that lay ahead.</p>
            
            <h3>The Early Years at CIHS</h3>
            <p>During my time at CIHS from nursery to class 10, I was exposed to a diverse curriculum that encouraged both analytical and creative thinking. The mathematics and science programs were particularly strong, laying the groundwork for my future in technology.</p>
            
            <p>I remember Mrs. Fatima Khatun's mathematics classes where she would challenge us with complex problems that seemed impossible at first. These problem-solving sessions taught me persistence and logical thinking - skills that would prove invaluable in my programming career.</p>
            
            <h3>The Transition to Higher Education</h3>
            <p>After graduating from CIHS, I pursued computer science at a local university. The foundation I had received at CIHS made the transition smooth. The discipline, time management, and study habits I had developed served me well.</p>
            
            <p>During university, I participated in programming competitions and hackathons. The competitive spirit that was nurtured at CIHS through various inter-house competitions gave me the confidence to participate and excel in these events.</p>
            
            <h3>Breaking into Silicon Valley</h3>
            <p>Landing my first job at a Silicon Valley tech company was a dream come true. The interview process was rigorous, involving multiple rounds of technical assessments and problem-solving sessions. The analytical skills and ability to think under pressure that I had developed at CIHS were crucial during these interviews.</p>
            
            <p>Working at Google, Apple, and eventually starting my own tech company, I often reflect on how my CIHS education shaped my approach to problem-solving and innovation. The school's emphasis on excellence and continuous learning became the pillars of my professional philosophy.</p>
            
            <h3>Giving Back to CIHS</h3>
            <p>Success comes with responsibility. I've established a scholarship fund for CIHS students pursuing STEM education and regularly mentor current students interested in technology careers. It's my way of giving back to the institution that gave me so much.</p>
            
            <p>The network of CIHS alumni in the tech industry has also been instrumental in my journey. We regularly organize meetups and support each other's ventures, maintaining the spirit of community that was instilled in us during our school days.</p>
            
            <h3>Advice for Current Students</h3>
            <p>To current CIHS students, I want to say that your journey is just beginning. Embrace the challenges, seek help when needed, and never stop learning. The foundation you're building now will serve you throughout your life, no matter which path you choose.</p>
            
            <p>The world of technology is constantly evolving, but the fundamental principles of problem-solving, critical thinking, and perseverance that CIHS teaches will always be relevant. Dream big, work hard, and remember that your CIHS family is always here to support you.</p>
        `,
    author: 'Ahmed Rahman',
    authorBio: 'Ahmed Rahman is a CIHS alumnus (Class of 1995) and currently serves as CTO at a leading Silicon Valley tech company. He has over 15 years of experience in the technology industry.',
    authorImage: '/images/alumni/ahmed-rahman.jpg',
    date: 'November 20, 2024',
    readTime: '8 min read',
    category: 'Career',
    tags: ['Technology', 'Career', 'Success Story', 'Silicon Valley'],
    image: '/images/blogs/silicon-valley-detail.jpg',
    views: 1234,
    likes: 89
}

export const relatedBlogs = [
    {
        id: 2,
        title: 'Building a Startup: Lessons from CIHS',
        author: 'Fatima Sheikh',
        image: '/images/blogs/startup.jpg',
        category: 'Business'
    },
    {
        id: 3,
        title: 'Medical Career Path: From CIHS to Johns Hopkins',
        author: 'Dr. Ayesha Begum',
        image: '/images/blogs/medical-career.jpg',
        category: 'Career'
    }
]
