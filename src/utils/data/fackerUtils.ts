import { faker, en, Faker, fakerEn, fakerJa } from '@faker-js/faker'

type SupportedLanguage = 'en' | 'ja'; // extend this list as needed

type user = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  bloodGroup: string;
  birthDate: string;
  jobTitle: string;
  companyName: string;
  website: string;
  ipAddress: string;
  macAddress: string;
  deviceId: string;
  username: string;
  password: string;
  avatar: string;
  nationality: string;
  language: SupportedLanguage;
  currency: string;
  timezone: string;
  browser: string;
  os: string;
  userAgent: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
    locale: SupportedLanguage;
  };
};

/**
 * Returns a field from a localized user object
 */
export function getFakeUserData(
  language: SupportedLanguage
): user {
  const faker = language === 'ja' ? fakerJa : fakerEn;
  const gender = faker.person.sex() as 'male' | 'female';

  const user: user = {
    firstName: faker.person.firstName(gender).toUpperCase(),
    lastName: faker.person.lastName(gender).toUpperCase(),
    fullName: faker.person.fullName({ sex: gender }),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    postalCode: faker.location.zipCode(),
    gender,
    height: faker.number.int({ min: 140, max: 200 }), // cm
    weight: faker.number.int({ min: 40, max: 110 }),  // kg
    bloodGroup: faker.helpers.arrayElement(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']),
    birthDate: faker.date.birthdate().toISOString(),
    jobTitle: faker.person.jobTitle(),
    companyName: faker.company.name(),
    website: faker.internet.url(),
    ipAddress: faker.internet.ip(),
    macAddress: faker.internet.mac(),
    deviceId: faker.string.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
    nationality: faker.location.countryCode(),
    language,
    currency: faker.finance.currencyCode(),
    timezone: faker.location.timeZone(),
    browser: faker.internet.userAgent(),
    os: faker.system.os(),
    userAgent: faker.internet.userAgent(),
    emailVerified: faker.datatype.boolean(),
    phoneVerified: faker.datatype.boolean(),
    preferences: {
      theme: faker.helpers.arrayElement(['dark', 'light']),
      notifications: faker.datatype.boolean(),
      locale: language
    }
  };

  return user;
}
/**
 * Returns a random locale based on the supported languages
 */

function generateFormattedDate(dateformat: string): string {
  let daterange : any;
  let formatdate : any;
  if(dateformat=="dob"){
    daterange = faker.date.birthdate({ min: 18, max: 60, mode: "age" });
    const mm = String(daterange.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const dd = String(daterange.getDate()).padStart(2, "0");
    const yyyy = daterange.getFullYear();
    formatdate = daterange.toISOString().split("T")[0];
  }else{
    daterange = faker.date.past(); //last one year date it will take by default
    formatdate = daterange.toISOString();
  }

  return formatdate;
}
