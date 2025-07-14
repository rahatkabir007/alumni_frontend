const students = [
    {
        id: 1,
        name: 'Dr. Rahman Ahmed',
        batch: '2005',
        class: '10',
        profession: 'Surgeon at Johns Hopkins Hospital',
        location: 'Baltimore, USA',
        image: '/images/alumni/rahman.jpg',
        achievements: 'Renowned cardiac surgeon, Published 50+ research papers'
    },
    {
        id: 2,
        name: 'Eng. Fatima Khan',
        batch: '2010',
        class: '10',
        profession: 'Software Engineer at Google',
        location: 'California, USA',
        image: '/images/alumni/fatima.jpg',
        achievements: 'Lead engineer on Google Search, Multiple patents holder'
    },
    {
        id: 3,
        name: 'Prof. Nasir Uddin',
        batch: '2008',
        class: '10',
        profession: 'Professor at University of Dhaka',
        location: 'Dhaka, Bangladesh',
        image: '/images/alumni/nasir.jpg',
        achievements: 'Head of Physics Department, Research in Quantum Computing'
    },
    {
        id: 4,
        name: 'Dr. Ayesha Begum',
        batch: '2012',
        class: '10',
        profession: 'Pediatrician',
        location: 'Chittagong, Bangladesh',
        image: '/images/alumni/ayesha.jpg',
        achievements: 'Founder of Children&apos;s Health Foundation'
    },
    {
        id: 5,
        name: 'Mohammad Karim',
        batch: '2007',
        class: '10',
        profession: 'CEO at Tech Startup',
        location: 'Singapore',
        image: '/images/alumni/karim.jpg',
        achievements: 'Founded 3 successful startups, Forbes 30 under 30'
    },
    {
        id: 6,
        name: 'Rashida Sultana',
        batch: '2015',
        class: '10',
        profession: 'Diplomat',
        location: 'London, UK',
        image: '/images/alumni/rashida.jpg',
        achievements: 'Ambassador to UK, Human Rights Advocate'
    }
]

const batches = ['all', '2005', '2007', '2008', '2010', '2012', '2015', '2018', '2020', '2022', '2024']
const classes = ['all', 'Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']


const student = {
    id: 1,
    name: 'Dr. Rahman Ahmed',
    batch: '1985',
    class: '10',
    profession: 'Cardiac Surgeon',
    currentPosition: 'Chief of Cardiothoracic Surgery',
    organization: 'Johns Hopkins Hospital',
    location: 'Baltimore, Maryland, USA',
    email: 'rahman.ahmed@jhmi.edu',
    phone: '+1-410-555-0123',
    image: '/images/alumni/rahman-profile.jpg',
    joinedYear: '1975',
    graduatedYear: '1985',
    achievements: [
        'Renowned cardiac surgeon with 30+ years of experience',
        'Published 50+ research papers in cardiovascular medicine',
        'Performed over 2,000 successful heart surgeries',
        'Recipient of Outstanding Alumni Award 2020',
        'Board member of American Heart Association'
    ],
    education: [
        {
            degree: 'Secondary School Certificate (SSC)',
            institution: 'Chittagong Ideal High School',
            year: '1985',
            grade: 'A+'
        },
        {
            degree: 'Higher Secondary Certificate (HSC)',
            institution: 'Chittagong College',
            year: '1987',
            grade: 'A+'
        },
        {
            degree: 'MBBS',
            institution: 'Chittagong Medical College',
            year: '1993',
            grade: 'First Class'
        },
        {
            degree: 'MD in Cardiothoracic Surgery',
            institution: 'Johns Hopkins University',
            year: '1998',
            grade: 'Summa Cum Laude'
        }
    ],
    experience: [
        {
            position: 'Chief of Cardiothoracic Surgery',
            organization: 'Johns Hopkins Hospital',
            period: '2010 - Present',
            description: 'Leading the cardiothoracic surgery department, overseeing complex cardiac procedures and research initiatives.'
        },
        {
            position: 'Senior Cardiac Surgeon',
            organization: 'Mayo Clinic',
            period: '2005 - 2010',
            description: 'Performed advanced cardiac surgeries and contributed to medical research and education.'
        },
        {
            position: 'Cardiac Surgery Fellow',
            organization: 'Cleveland Clinic',
            period: '2000 - 2005',
            description: 'Specialized training in complex cardiac procedures and minimally invasive techniques.'
        }
    ],
    socialContributions: [
        'Established free cardiac surgery program for underprivileged patients',
        'Founded "Hearts for Bangladesh" charity organization',
        'Regular medical missions to rural areas of Bangladesh',
        'Mentored 20+ medical students and residents',
        'Guest lecturer at various medical institutions'
    ],
    quotes: '"The foundation I received at CIHS taught me discipline, perseverance, and the importance of serving others. These values have guided my entire medical career since my graduation from this 27-year-old institution."',
    socialMedia: {
        linkedin: 'https://linkedin.com/in/rahmanahmed',
        twitter: 'https://twitter.com/drahmed',
        facebook: 'https://facebook.com/rahman.ahmed'
    }
}

export {
    students,
    batches,
    classes,
    student
}