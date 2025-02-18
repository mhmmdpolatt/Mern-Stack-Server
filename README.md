Bu proje, kullanıcıların blog gönderileri oluşturabileceği, beğenebileceği, yorum yapabileceği ve diğer kullanıcıları takip edebileceği bir platformun server kısmını  temsil eder.

API Bağlantıları:
Tüm Bloglar JSON:
https://myblog-md-e9c7810a4c96.herokuapp.com/blog/allBlog
Bu API, tüm blog gönderilerini JSON formatında döndürür. İçeriklerin HTML etiketleri ile geldiğini unutmayın ve yukarıdaki güvenlik önlemlerine dikkat edin.
Diğer Bağlantılar İçin Controller Klasörünü İnceleyebilirsiniz



## **Backend**
- **Teknolojiler:** Node.js, Express.js, MongoDB
- **Kimlik Doğrulama:** JWT (JSON Web Tokens)
- **Dağıtım:** Netlify (Frontend), Heroku (Backend)

## **Kullanıcı İşlemleri**
- **Kayıt ve Giriş:** JWT ile kimlik doğrulama yapılır. Her kullanıcıya token verilir ve bu token, kullanıcıyı doğrulamak için her istekte kullanılır.
- **Profil Düzenleme:** Kullanıcılar kendi profillerini oluşturabilir ve düzenleyebilir. Bu bilgiler güvenli şekilde veritabanında saklanır.
- **Takip Etme:** Kullanıcılar diğer kullanıcıları takip edebilir ve takipçi sayısı görüntülenebilir.

## **Gönderi İşlemleri**
- **Gönderi Paylaşma:** Kullanıcılar yeni blog gönderileri oluşturabilir. Her gönderi, kullanıcı tarafından başlatılır ve kendi profilinde görüntülenir.
- **Beğenme ve Yorum Yapma:** Kullanıcılar gönderilere beğeni bırakabilir ve yorum yapabilir. Yorumlar, belirli bir gönderiye ait olacak şekilde ilişkilendirilir.

## **Geliştiriciler İçin Önemli Notlar**

### **HTML İçeriği ve Güvenlik:**
Backend'den gelen içeriklerde **HTML etiketleri** olabilir. Bu tür içerikler frontend'de **dangerouslySetInnerHTML** gibi yöntemlerle eklenirken dikkat edilmelidir.

#### **Frontend Güvenlik Önlemleri:**
- **HTML etiketlerini temizleyin:** Eğer backend'den HTML içeriği alıyorsanız, frontend'de bu içerikleri sadece metin olarak gösterin veya güvenli hale getirmek için uygun sanitasyon yapın.
- **dangerouslySetInnerHTML kullanırken dikkatli olun:** React uygulamanızda bu özelliği kullanıyorsanız, yalnızca temizlenmiş ve güvenli içerikleri kullanın.



## **Özetle:**
Geliştiriciler, özellikle **HTML içeriği** ve **güvenlik** konularına dikkat etmelidir. **XSS** gibi saldırılara karşı korunmak için backend'den gelen veriyi doğru şekilde temizlemeli ve frontend'de güvenli şekilde render edilmelidir. Bu noktada **DOMPurify** veya **sanitize-html** gibi kütüphaneler kullanmak en iyi yöntemdir.

## **Kurulum**

1. **Backend'inizi çalıştırmak için:**
   - Backend dizininde terminali açın.
   - `npm install` komutunu kullanarak bağımlılıkları yükleyin.
   - `npm start` komutunu kullanarak backend sunucusunu başlatın.



