# Banko Arts Portfolio

Modern ve profesyonel 3D sanatçı portfolyo web sitesi.

## Özellikler

- ✨ Modern ve minimalist tasarım
- 🎨 3D mimari görselleştirme portföyü
- 📊 İstatistik gösterimi (824+ proje, 10 yıl deneyim)
- 🎯 Servis tanıtımları
- 📰 Son haberler bölümü
- 📧 İletişim formu (email gönderimi)
- 🎬 Video/animasyon gösterimi
- 🔍 Görsel zoom ve pan özellikleri
- 📱 Responsive tasarım

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Email Servisi Kurulumu (Resend)

Contact formu çalışması için Resend API anahtarına ihtiyacınız var:

1. [Resend.com](https://resend.com) adresine gidin ve ücretsiz hesap oluşturun
2. API Keys bölümünden yeni bir API key oluşturun
3. `.env.local` dosyasını düzenleyin:

```env
RESEND_API_KEY=re_your_actual_api_key_here
CONTACT_EMAIL=contact@bankoarts.com
```

**ÖNEMLİ:** `.env.local` dosyası git'e eklenmez. Güvenlik için API anahtarlarınızı kimseyle paylaşmayın.

### 3. Development Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Email Gönderimi Test Etme

Contact formu doldurup "Send Message" butonuna bastığınızda:

1. Form verileri `/api/contact` endpoint'ine POST edilir
2. Resend API üzerinden email gönderilir
3. Başarılı olursa yeşil başarı mesajı gösterilir
4. Email `CONTACT_EMAIL` adresine gelir

**Test için:** Resend'in ücretsiz planında yalnızca doğrulanmış email adreslerine mail gönderebilirsiniz. Production'da kendi domain'inizi doğrulamanız gerekir.

## Production Build

```bash
npm run build
npm start
```

## Proje Yapısı

```
banko-arts-portfolio/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.js          # Email API endpoint
│   ├── components/
│   │   └── ContactForm.js        # İletişim formu component
│   ├── page.js                    # Ana sayfa
│   └── layout.js                  # Layout
├── public/
│   ├── images/                    # Görsel dosyaları
│   └── videos/                    # Video dosyaları
├── .env.local                     # Çevre değişkenleri (git'e eklenmez)
├── .env.example                   # Örnek çevre değişkenleri
└── README.md
```

## Teknolojiler

- **Framework:** Next.js 15
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Email Service:** Resend
- **Fonts:** Bebas Neue, Oswald

## Yeni Proje Ekleme

`app/page.js` dosyasındaki `architectureProjects` dizisine yeni proje ekleyin:

```javascript
{
    title: "Proje Adı",
    category: "Interior", // veya "Exterior" veya "Mixed"
    type: "render", // veya "animation"
    image: "/images/architecture/proje-resmi.png",
    video: "/videos/proje-videosu.mp4" // sadece animation tipinde
}
```

## Sosyal Medya Linkleri

`app/page.js` dosyasındaki sosyal medya linklerini kendi profilinize göre güncelleyin.

## Lisans

Bu proje Banko Arts için geliştirilmiştir.
