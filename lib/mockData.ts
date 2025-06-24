import { Crew } from '../types/crew';

export const mockCrews: Crew[] = [
  {
    id: 'rec1',
    CrewName: "Berlin Street Runners",
    City: "Berlin",
    Country: "Germany",
    Continent: "Europe",
    FoundingDate: "2018-06-15",
    CrewStoryExcerpt: "Urban running through the heart of Berlin with weekly street runs and monthly challenges.",
    ApproxMemberCount: 250,
    MembershipType: "Free",

    InstagramURL: "https://instagram.com/berlinstreetrunners",
    StravaClubURL: "https://strava.com/clubs/berlinstreetrunners",
    Featured: true,
    PrimaryImageUrl: "https://images.pexels.com/photos/3764154/pexels-photo-3764154.jpeg",
    HeadquarterLatitude: 52.5200,
    HeadquarterLongitude: 13.4050,
    schedules: [
      {
        RunName: "Tuesday Night Run",
        DayOfWeek: "Tuesday",
        Time: "19:00",
        DistanceDescription: "5-8K",
        PaceDescription: "Conversational pace",
        RunningType: "Street Run",
        RunSchedulesStatus: "Active",
        Status: "publish"
      },
      {
        RunName: "Saturday Long Run",
        DayOfWeek: "Saturday",
        Time: "09:00",
        DistanceDescription: "10-15K",
        PaceDescription: "Mixed pace groups",
        RunningType: "Street Run",
        RunSchedulesStatus: "Active",
        Status: "publish"
      }
    ],
    teamMembers: [
      {
        MemberName: "Anna Schmidt",
        Role: ["Founder", "Captain"],
        MemberStatus: "Active",
        Status: "publish"
      }
    ]
  },
  {
    id: 'rec2',
    CrewName: "NYC Night Runners",
    City: "New York City",
    Country: "USA",
    Continent: "North America",
    FoundingDate: "2020-03-10",
    CrewStoryExcerpt: "Experience the city that never sleeps through midnight runs and dawn adventures.",
    ApproxMemberCount: 180,
    MembershipType: "Paid",
    MembershipFeeInfo: "$25/month",

    InstagramURL: "https://instagram.com/nycnightrunners",
    StravaClubURL: "https://strava.com/clubs/nycnightrunners",
    Featured: true,
    PrimaryImageUrl: "https://images.pexels.com/photos/3766204/pexels-photo-3766204.jpeg",
    HeadquarterLatitude: 40.7128,
    HeadquarterLongitude: -74.0060,
    schedules: [
      {
        RunName: "Midnight Manhattan",
        DayOfWeek: "Friday",
        Time: "23:30",
        DistanceDescription: "8-12K",
        PaceDescription: "Moderate pace",
        RunningType: "Street Run",
        RunSchedulesStatus: "Active",
        Status: "publish"
      }
    ]
  },
  {
    id: 'rec3',
    CrewName: "Sydney Coastal Crew",
    City: "Sydney",
    Country: "Australia",
    Continent: "Oceania",
    FoundingDate: "2021-01-20",
    CrewStoryExcerpt: "Beach runs, harbor views, and the best sunrise sessions in Sydney.",
    ApproxMemberCount: 95,
    MembershipType: "Free",

    InstagramURL: "https://instagram.com/sydneycoastalcrew",
    Featured: false,
    PrimaryImageUrl: "https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg",
    HeadquarterLatitude: -33.8688,
    HeadquarterLongitude: 151.2093,
    schedules: [
      {
        RunName: "Sunrise Beach Run",
        DayOfWeek: "Saturday",
        Time: "06:00",
        DistanceDescription: "8K",
        PaceDescription: "Easy pace",
        RunningType: "Street Run",
        RunSchedulesStatus: "Active",
        Status: "publish"
      }
    ]
  },
  {
    id: 'rec4',
    CrewName: "Tokyo Urban Pacers",
    City: "Tokyo",
    Country: "Japan",
    Continent: "Asia",
    FoundingDate: "2019-04-01",
    CrewStoryExcerpt: "Exploring Tokyo's neighborhoods through structured group runs and cultural experiences.",
    ApproxMemberCount: 145,
    MembershipType: "Paid",
    MembershipFeeInfo: "¥2000/month",

    InstagramURL: "https://instagram.com/tokyourbanpacers",
    StravaClubURL: "https://strava.com/clubs/tokyourbanpacers",
    Featured: false,
    PrimaryImageUrl: "https://images.pexels.com/photos/3775156/pexels-photo-3775156.jpeg",
    HeadquarterLatitude: 35.6762,
    HeadquarterLongitude: 139.6503,
    schedules: [
      {
        RunName: "Neighborhood Explorer",
        DayOfWeek: "Wednesday",
        Time: "19:30",
        DistanceDescription: "6-8K",
        PaceDescription: "Conversational",
        RunningType: "Street Run",
        RunSchedulesStatus: "Active",
        Status: "publish"
      }
    ]
  },
  {
    id: 'rec5',
    CrewName: "São Paulo Trail Collective",
    City: "São Paulo",
    Country: "Brazil",
    Continent: "South America",
    FoundingDate: "2020-08-15",
    CrewStoryExcerpt: "Urban trail running in South America's largest city with park adventures.",
    ApproxMemberCount: 78,
    MembershipType: "Free",

    InstagramURL: "https://instagram.com/sptrailcollective",
    Featured: true,
    PrimaryImageUrl: "https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg",
    HeadquarterLatitude: -23.5505,
    HeadquarterLongitude: -46.6333,
    schedules: [
      {
        RunName: "Park Trail Run",
        DayOfWeek: "Sunday",
        Time: "07:00",
        DistanceDescription: "10-15K",
        PaceDescription: "Varied pace",
        RunningType: "Trailrun",
        RunSchedulesStatus: "Active",
        Status: "publish"
      }
    ]
  },
  {
    id: 'rec6',
    CrewName: "Cape Town Mountain Runners",
    City: "Cape Town",
    Country: "South Africa",
    Continent: "Africa",
    FoundingDate: "2017-11-12",
    CrewStoryExcerpt: "Trail running with stunning mountain and ocean views in the Mother City.",
    ApproxMemberCount: 120,
    MembershipType: "Free",

    InstagramURL: "https://instagram.com/capetownmountainrunners",
    Featured: true,
    PrimaryImageUrl: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg",
    HeadquarterLatitude: -33.9249,
    HeadquarterLongitude: 18.4241,
    schedules: [
      {
        RunName: "Table Mountain Trail",
        DayOfWeek: "Saturday",
        Time: "06:30",
        DistanceDescription: "12-18K",
        PaceDescription: "Challenging",
        RunningType: "Trailrun",
        RunSchedulesStatus: "Active",
        Status: "publish"
      }
    ]
  }
];