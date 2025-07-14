const teachers = [
    {
        id: 1,
        name: 'Prof. Nasir Uddin',
        designation: 'Former Principal',
        department: 'Administration',
        period: '2000-2020',
        status: 'retired',
        subjects: ['Leadership', 'Educational Management'],
        achievements: 'Led CIHS for 20 years, Established scholarship programs',
        image: '/images/teachers/nasir-uddin.jpg',
        specialization: 'Educational Leadership'
    },
    {
        id: 2,
        name: 'Mrs. Fatima Khatun',
        designation: 'Senior Mathematics Teacher',
        department: 'Mathematics',
        period: '1999-2015',
        status: 'retired',
        subjects: ['Advanced Mathematics', 'Calculus', 'Statistics'],
        achievements: 'Best Teacher Award 2005, Mentored 500+ students',
        image: '/images/teachers/fatima-khatun.jpg',
        specialization: 'Pure Mathematics'
    },
    {
        id: 3,
        name: 'Dr. Abdul Karim',
        designation: 'Head of Science Department',
        department: 'Science',
        period: '2005-Present',
        status: 'active',
        subjects: ['Physics', 'Chemistry', 'Research Methodology'],
        achievements: 'PhD in Physics, Published 30+ research papers',
        image: '/images/teachers/abdul-karim.jpg',
        specialization: 'Theoretical Physics'
    },
    {
        id: 4,
        name: 'Mrs. Rashida Begum',
        designation: 'English Department Head',
        department: 'Languages',
        period: '2010-Present',
        status: 'active',
        subjects: ['English Literature', 'Creative Writing', 'Public Speaking'],
        achievements: 'Masters in English Literature, Drama Club Coordinator',
        image: '/images/teachers/rashida-begum.jpg',
        specialization: 'English Literature'
    },
    {
        id: 5,
        name: 'Mr. Shahid Hassan',
        designation: 'Physical Education Instructor',
        department: 'Sports',
        period: '2008-2023',
        status: 'retired',
        subjects: ['Physical Education', 'Sports Science', 'Health Education'],
        achievements: 'National Sports Award, Trained Olympic athletes',
        image: '/images/teachers/shahid-hassan.jpg',
        specialization: 'Athletic Training'
    },
    {
        id: 6,
        name: 'Mrs. Salma Khatun',
        designation: 'Computer Science Teacher',
        department: 'Technology',
        period: '2020-Present',
        status: 'active',
        subjects: ['Computer Programming', 'Web Development', 'Database Management'],
        achievements: 'IT Innovation Award, Digitalized school records',
        image: '/images/teachers/salma-khatun.jpg',
        specialization: 'Computer Science'
    }
]

const departments = ['all', 'Administration', 'Mathematics', 'Science', 'Languages', 'Sports', 'Technology']
const statuses = ['all', 'active', 'retired']

const teacher = {
    id: 1,
    name: 'Prof. Nasir Uddin',
    designation: 'Former Principal',
    department: 'Administration',
    period: '2000-2020',
    status: 'retired',
    subjects: ['Leadership', 'Educational Management', 'Strategic Planning', 'School Administration'],
    achievements: [
        'Led CIHS for 20 years with distinction',
        'Established multiple scholarship programs',
        'Increased school enrollment by 300%',
        'Implemented modern teaching methodologies',
        'Recipient of National Education Excellence Award'
    ],
    image: '/images/teachers/nasir-uddin.jpg',
    specialization: 'Educational Leadership',
    education: [
        'PhD in Education Administration - University of Dhaka',
        'Masters in Educational Leadership - Teachers Training College',
        'Bachelor of Education - Chittagong University'
    ],
    experience: [
        {
            position: 'Principal',
            institution: 'Chittagong Ideal High School',
            period: '2000-2020',
            description: 'Led the institution through major expansion and modernization phases.'
        },
        {
            position: 'Vice Principal',
            institution: 'Chittagong Model School',
            period: '1995-2000',
            description: 'Assisted in administrative duties and curriculum development.'
        },
        {
            position: 'Senior Teacher',
            institution: 'Chittagong Grammar School',
            period: '1990-1995',
            description: 'Taught advanced courses and mentored junior faculty.'
        }
    ],
    publications: [
        'Modern Educational Leadership in Bangladesh (2015)',
        'Building Sustainable School Communities (2012)',
        'The Future of Secondary Education (2018)'
    ],
    quote: "Education is not preparation for life; education is life itself. Every student has the potential to change the world.",
    email: 'nasir.uddin@cihs.edu.bd',
    phone: '+880-31-123456',
    officeHours: 'Monday-Friday, 9:00 AM - 4:00 PM',
    studentsFeedback: [
        {
            name: 'Ahmed Rahman',
            batch: 'Class of 2010',
            feedback: 'Sir Nasir was not just a principal but a mentor who guided us towards excellence.'
        },
        {
            name: 'Fatima Sheikh',
            batch: 'Class of 2015',
            feedback: 'His leadership transformed our school experience and prepared us for the real world.'
        }
    ]
}

export {
    teachers,
    departments,
    statuses,
    teacher
}