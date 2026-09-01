const SpeakingExamEngine = {
    recognition: null,
    isListening: false,

    initSpeechRecognition(onResultCallback, onEndCallback) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("⚠️ Brauzeringiz nutqni tanishni qo'llab-quvvatlamaydi. Iltimos, Google Chrome brauzeridan foydalaning.");
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true; // Real vaqtda yozib borish
        this.recognition.lang = 'en-US'; // Ingliz tili talaffuzi uchun

        this.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            onResultCallback(transcript);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (onEndCallback) onEndCallback();
        };

        return true;
    },

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this.isListening = true;
        }
    },

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
};