PRANJAL STUDY BOOK – Web App
==============================

इस फ़ोल्डर में मोबाइल-फ्रेंडली PWA वेब ऐप है।

सुविधाएँ:
- Subject और Chapter के साथ प्रश्न सेव करना
- MCQ, Fill in the blanks, True/False, Short answer
- फोन के ब्राउज़र में localStorage द्वारा स्थानीय डेटा सेव
- उत्तर दिखाना/छिपाना
- गलत प्रश्न चिह्नित करना और wrong-only filter
- प्रश्न बोलकर सुनना (यदि ब्राउज़र speech synthesis सपोर्ट करे)
- बोलकर उत्तर देने की कोशिश और text की सरल तुलना
- JSON बैकअप डाउनलोड/इम्पोर्ट
- चुनी गई scan files के नाम दिखाना (अभी OCR नहीं)

सीमाएँ:
- Speech recognition ब्राउज़र/फोन की सुविधा और अक्सर इंटरनेट पर निर्भर है; इसे पूरी तरह offline न मानें।
- बोली गई short answer की जाँच semantic/AI grading नहीं है; यह केवल सरल text matching है।
- Camera/PDF OCR और पुस्तक से exact answer matching अभी लागू नहीं हैं।
- डेटा उसी ब्राउज़र के local storage में रहता है। ब्राउज़र डेटा हटाने या फोन बदलने पर डेटा जा सकता है; बैकअप रखें।

मोबाइल में इस्तेमाल:
1. इस फ़ोल्डर को HTTPS hosting पर publish करें (उदाहरण: GitHub Pages)।
2. Android फोन में Chrome से प्रकाशित link खोलें।
3. Chrome menu → Add to Home screen / Install app चुनें।
4. पहली बार पेज खोलने के बाद app shell cache हो जाएगा और फिर offline खुल सकेगा।

नोट: PWA service worker केवल HTTPS या localhost पर काम करता है; ZIP को सीधे file:// से खोलने पर install/offline सुविधा नहीं चलेगी।
