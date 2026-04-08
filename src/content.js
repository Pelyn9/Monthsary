import bestPicture1 from "./images/bestpicture1.jpg";
import bestPicture2 from "./images/bestpicture2.jpg";
import bestPicture3 from "./images/bestpicture3.jpg";
import replayPhoto1 from "./images/image2/1.jpg";
import replayPhoto2 from "./images/image2/2.jpg";
import replayPhoto3 from "./images/image2/3.jpg";
import replayPhoto4 from "./images/image2/4.jpg";
import replayPhoto5 from "./images/image2/5.jpg";
import replayPhoto6 from "./images/image2/6.jpg";
import replayPhoto7 from "./images/image2/7.jpg";
import replayPhoto8 from "./images/image2/8.jpg";
import replayPhoto9 from "./images/image2/9.jpg";
import replayPhoto10 from "./images/image2/10.jpg";

export const siteContent = {
  // Edit your names here.
  names: {
    fromName: "Em-Em",
    toName: "My Beautiful Pangging",
  },

  // Edit your real monthsary start date here.
  relationshipStart: "2021-07-09",

  // Edit the hero text here.
  hero: {
    eyebrow: "A purple monthsary universe made just for us",
    intro: "Welcome to",
    words: [
      "our love story",
      "our Futu",
      "our soft little world",
      "our forever season",
    ],
    title: "Happy Monthsary, Asawa ko!",
    description:
      "I redesigned this page to feel more alive, more dreamy, and more like you. Purple light, tulips, floating photos, little letters, and all the soft things that make loving you feel beautiful.",
    cardTitle: "You are the calm in every future I imagine.",
    cardText:
      "Every month with you still feels like a fresh reason to be grateful. You are my favorite person, my answered prayer, and the warmth I want to keep choosing every single day.",
    badges: ["purple tulip mood"],
    sideQuote:
      "This whole page is my way of saying that loving you still feels beautiful, intentional, and worth celebrating out loud.",
  },

  // Edit the floating dock navigation labels here.
  dockLinks: [
    { title: "Home", href: "#home", icon: "home" },
    { title: "Photos", href: "#photos", icon: "photos" },
    { title: "Moments", href: "#moments", icon: "sparkle" },
    { title: "Stories", href: "#stories", icon: "book" },
    { title: "Letters", href: "#letters", icon: "letter" },
    { title: "Forever", href: "#forever", icon: "heart" },
  ],

  // Replace the image URLs below with your own couple photos if you want.
  draggablePhotos: [
    {
      title: "Do our best",
      caption: "The day I feel excited to get a job so that i want to mary you.",
      image: replayPhoto1,
      left: "7%",
      top: "10%",
      rotate: "-9deg",
    },
    {
      title: "I want you forever",
      caption: "You always make my heart warm and I will always take care of your heart.",
      image: replayPhoto2,
      left: "24%",
      top: "36%",
      rotate: "-6deg",
    },
    {
      title: "My Goddess",
      caption: "Your smile and your beauty is so divine.",
      image: replayPhoto3,
      left: "42%",
      top: "6%",
      rotate: "8deg",
    },
    {
      title: "Miles of love",
      caption: "The kind of scene that never really fades away. Always make beautiful memories.",
      image: replayPhoto4,
      left: "58%",
      top: "28%",
      rotate: "10deg",
    },
    {
      title: "Different schools, same hearts",
      caption: "Pinned here like a photo I never want to misplace.",
      image: replayPhoto5,
      left: "74%",
      top: "12%",
      rotate: "4deg",
    },
    {
      title: "Every step with you",
      caption: "I will be your forever PA. My Perfect Asawa",
      image: replayPhoto6,
      left: "60%",
      top: "52%",
      rotate: "-8deg",
    },
  ],

  // Replace the image URLs and text below for the smooth carousel.
  carouselSlides: [
    {
      title: "Moment 01",
      caption: "Dates, dreams, and little scenes I still linger on.",
      src: replayPhoto7,
    },
    {
      title: "Moment 02",
      caption: "This one stays soft in my mind no matter how much time passes.",
      src: replayPhoto8,
    },
    {
      title: "Moment 03",
      caption: "A memory that moves slowly and still never really leaves.",
      src: replayPhoto9,
    },
    {
      title: "Moment 04",
      caption: "One more little scene I know I will keep coming back to.",
      src: replayPhoto10,
    },
  ],

  // Edit the stories below. Replace the image URLs and paragraphs with your own.
  // To add music inside a chapter modal, add an `audio` object to any story.
  // `src` can be a direct audio file path or a YouTube link.
  // audio: {
  //   src: "/music/your-song.mp3",
  //   title: "Your Song",
  //   label: "Cassette tape",
  //   note: "Plays automatically when the chapter opens.",
  //   loop: true,
  // },
  expandableStories: [
    {
      title: "The first spark",
      description: "When everything started to feel different.",
      src: bestPicture1,
      ctaText: "Open story",
      audio: {
        src: "https://www.youtube.com/watch?v=5HZ9qeFjhYk&list=RD5HZ9qeFjhYk&start_radio=1",
        title: "Now playing",
        label: "Soundtrack",
        note: "This chapter opens with your first song automatically.",
        autoPlay: true,
        loop: true,
      },
      content: [
        "Some people enter life quietly, then somehow change the whole atmosphere. That is how you felt to me. Gentle, glowing, impossible to ignore once my heart truly noticed you.",
        "I still think about how something so simple became something so important. It was not loud. It was not rushed. It just kept becoming more real, more beautiful, and more impossible to let go of.",
      ],
    },
    {
      title: "The comfort of us",
      description: "How you became my safest place.",
      src: bestPicture2,
      ctaText: "Read note",
      audio: {
        src: "https://www.youtube.com/watch?v=908773h7OAM&list=RD908773h7OAM&start_radio=1",
        title: "Now playing",
        label: "Soundtrack",
        note: "This chapter opens with your second song automatically.",
        autoPlay: true,
        loop: true,
      },
      content: [
        "You became the person I wanted to tell everything to. The biggest dream. The smallest worry. The random thought in the middle of the night. That kind of comfort is rare, and I never want to take it lightly.",
        "What I love most is not only the excitement of loving you. It is the peace. It is the way being near you makes my heart feel less noisy and more sure of itself.",
      ],
    },
    {
      title: "The future I choose",
      description: "Why forever feels worth believing in.",
      src: bestPicture3,
      ctaText: "See promise",
      audio: {
        src: "https://www.youtube.com/watch?v=GcgPbu5CxX8&list=RDGcgPbu5CxX8&start_radio=1",
        title: "Now playing",
        label: "Soundtrack",
        note: "This chapter opens with your third song automatically.",
        autoPlay: true,
        loop: true,
      },
      content: [
        "When I think about the future, I do not just imagine milestones. I imagine your laugh in the kitchen, your hand in mine, your voice turning ordinary evenings into something I will always remember.",
        "That is why this is more than a website. It is my little way of saying that I am still here, still grateful, and still serious about loving you well.",
      ],
    },
  ],

  // Edit these hover cards for the cursor glow section.
  hoverLetters: [
    {
      title: "Your smile",
      subtitle: "The one that undoes my whole day in the best way.",
      detail:
        "When you smile, even my most tired moments feel lighter. That is not a small thing. That is magic.",
    },
    {
      title: "Your voice",
      subtitle: "The sound I want around my ordinary life.",
      detail:
        "There is comfort in the way you talk, laugh, and say my name. Home can sound like a person, and for me it sounds like you.",
    },
    {
      title: "Our future",
      subtitle: "The dream I keep reaching toward.",
      detail:
        "I do not only love the memories behind us. I love the life ahead of us, too. I want to keep building that with intention.",
    },
  ],

  // Edit these stack cards. Clicking the stack moves to the next card.
  stackLetters: [
    {
      id: 1,
      name: "Little Letter One",
      designation: "For your soft heart",
      content:
        "I hope you always know this: being loved by you has changed the way I see tenderness. You made love feel gentle instead of scary.",
    },
    {
      id: 2,
      name: "Little Letter Two",
      designation: "For our quiet moments",
      content:
        "Some of my favorite memories are not dramatic at all. They are the simple ones. The calm ones. The ones where your presence makes everything enough.",
    },
    {
      id: 3,
      name: "Little Letter Three",
      designation: "For the future",
      content:
        "If life gives us busy days, hard days, and uncertain days, I still want to be the person who keeps returning to you with softness and sincerity.",
    },
    {
      id: 4,
      name: "Little Letter Four",
      designation: "For this monthsary",
      content:
        "Happy monthsary, my love. I would still choose your hand, your laugh, your heart, and this love story over and over again.",
    },
  ],

  // Edit the scrolling quotes below.
  movingQuotes: [
    {
      quote: "I still choose you in every version of tomorrow I can imagine.",
      name: "Always",
      title: "My promise",
    },
    {
      quote: "You turned ordinary days into something I actually want to remember.",
      name: "Soft truth",
      title: "My gratitude",
    },
    {
      quote: "If home could smile, speak, and hold my hand, it would look a lot like you.",
      name: "Quiet confession",
      title: "My heart",
    },
    {
      quote: "I love the way we keep growing without losing our softness.",
      name: "Our story",
      title: "My favorite chapter",
    },
    {
      quote: "The future feels lighter because it has your name inside it.",
      name: "My hope",
      title: "My forever",
    },
    {
      quote: "You are still my favorite hello, my safest pause, and my sweetest peace.",
      name: "This month",
      title: "My love note",
    },
  ],
};
