````markdown
# 🌍 BookIt: Experiences & Slots

**BookIt** is a full-stack web application where users can explore curated travel experiences, view available time slots, apply promo codes, and complete bookings — all within a clean and responsive UI.

This project showcases **end-to-end MERN stack** (Next.js 16) development, including frontend + backend integration, real-world API workflows, and smooth user interactions.

---

## 🎯 Objective

Build a complete full-stack platform that allows users to:
- Explore and search experiences
- View real-time availability
- Apply discounts via promo codes
- Book experiences and receive confirmation emails

---

## 🧠 Tech Stack & Tools

| Layer | Technology |
|-------|-------------|
| **Frontend** | [Next.js 16](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [TypeScript](https://www.typescriptlang.org/), [Axios](https://axios-http.com/) |
| **Backend** | [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/) |
| **Utilities & Services** | [Cloudinary](https://cloudinary.com/) (File uploads), [Nodemailer](https://nodemailer.com/) (Emails), [Moment.js](https://momentjs.com/) (Date formatting), [Yup](https://github.com/jquense/yup) (Validation) |
| **Deployment & Version Control** | [Vercel](https://vercel.com/), [GitHub](https://github.com/) |

---

## ✨ Features

### 🧭 Experience Module
- Browse all travel experiences with **real-time search** (query handled on both frontend & backend)
- View **single experience details** dynamically

### 📅 Dynamic Availability
- Fetch and display **available dates and time slots** from the Booking API
- Sync between frontend and backend seamlessly

### 🎟️ Promo Code System
- Apply **fixed or percentage**-based discounts
- Validate coupons in real-time via `/api/promo-codes/validate`

### 🧾 Booking Flow
- Complete booking with **user details** (name, email)
- Generate and send **confirmation emails** with booking summary
- Include **“View Booking”** link in the email body

### 💌 Email Integration
- Automatic confirmation email sent using Nodemailer
- Custom HTML templates with booking details

### 💎 UI/UX
- Clean and minimal interface
- Fully **responsive** for mobile and desktop users
- Optimized for **speed and accessibility**

---

## ⚙️ API Endpoints

### 📚 Experience
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/experiences` | Get all experiences |
| `GET` | `/api/experiences/[id]` | Get experience by ID |
| `POST` | `/api/experiences` | Create a new experience |
| `PUT` | `/api/experiences/[id]` | Update an experience |

### 📁 File Upload
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/file` | Upload files (Cloudinary integration) |

### 🎟️ Promo Codes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/promo-codes` | Create a new promo code |
| `GET` | `/api/promo-codes` | Get all promo codes |
| `GET` | `/api/promo-codes/validate?code=WELCOME100` | Validate promo code |

### 🧾 Booking
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/bookings` | Create a booking with user details and pricing |


### 🔐 Authentication
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/verify-otp` | Verify OTP sent via email |
| `POST` | `/api/auth/login` | Login user with credentials |
| `POST` | `/api/auth/logout` | Logout user and clear session |

---

## 🧩 App Pages

| Page | Description |
|------|--------------|
| **Home Page** | Displays a list of experiences fetched from backend |
| **Details Page** | Shows selected experience details, available dates, and slots |
| **Checkout Page** | Collects user info, promo code, and shows price summary |
| **Result Page** | Displays booking confirmation or failure message |

---

## 🧠 SEO Example (generateMetadata)

```ts
// app/experiences/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const experience = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/experiences/${params.id}`).then(res => res.json());

  return {
    title: `${experience?.title} | BookIt`,
    description: experience?.shortDescription || "Discover amazing experiences around you.",
    openGraph: {
      title: `${experience?.title} | BookIt`,
      description: experience?.shortDescription,
      images: [experience?.image || "/default-og.png"],
    },
  };
}


## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone [https://github.com/yourusername/bookit.git](https://github.com/SURVI1508/bookIt-web.git)
cd bookit
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env.local` file in the root directory and add:

```env
MONGODB_URI=mongodb://localhost:27017/BookIt_Experiences
CLOUDINARY_CLOUD_NAME=TEST
CLOUDINARY_API_KEY=7889221
CLOUDINARY_API_SECRET=SECRATE
CLOUDINARY_URL=cloudinary://{DB}:9PolntGQ@dxfqemcrn
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=EXAM535@gmail.com
EMAIL_PASS=ihwfayga
MASTER_OTP=999999
JWT_SECRET_KEY=ahafsytet3ue
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

This app is deployed on **Vercel**.

To deploy manually:

```bash
vercel deploy
```

Make sure environment variables are configured in the Vercel dashboard.

---

## 🧰 Folder Structure

```
bookit/
├── app/
│   ├── (routes)/
│   │   ├── page.tsx          # Home page
│   │   ├── experiences/[id]/page.tsx  # Details page
│   │   ├── checkout/page.tsx  # Checkout page
│   │   └── result/page.tsx    # Result page
│   └── api/
│       ├── experiences/
│       ├── promo-codes/
│       ├── bookings/
│       └── file/
├── components/
├── lib/
├── models/
├── utils/
├── public/
└── package.json
```

---

## 💡 Future Enhancements

* 🧍 User authentication (JWT)
* 📊 Admin dashboard for managing experiences and bookings
* 💬 SMS notifications for booking confirmation
* 💵 Payment gateway integration
* SEO optimization (sitemap,image sitemap)
* performance optimization
* caching etc.

---

## 🧑‍💻 Author

**Sourav Gupta**
🚀 Full Stack Developer | Passionate about clean code, real-world web apps, and performance optimization
🔗 [LinkedIn](https://www.linkedin.com/in/sourav-gupta-7bb53523a) | [Portfolio](https://survi-dev.vercel.app/)

---

⭐ **If you like this project, don’t forget to star the repository!**

