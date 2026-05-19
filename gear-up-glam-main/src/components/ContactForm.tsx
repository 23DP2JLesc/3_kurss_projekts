import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vārds ir obligāts";
    } else if (formData.name.length > 100) {
      newErrors.name = "Vārdam jābūt mazākam par 100 rakstzīmēm";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-pasts ir obligāts";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Lūdzu, ievadi derīgu e-pasta adresi";
    } else if (formData.email.length > 255) {
      newErrors.email = "E-pastam jābūt mazākam par 255 rakstzīmēm";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Ziņa ir obligāta";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Ziņai jābūt mazākai par 1000 rakstzīmēm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contact" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-primary uppercase tracking-wider text-sm font-medium">
              Sazinies ar mums
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">Sazināties</h2>
            <p className="text-muted-foreground mt-4">
              Ir jautājumi par mūsu produktiem? Mēs esam gatavi palīdzēt.
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 animate-slide-up">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-green-500">
                Paldies! Tava ziņa ir nosūtīta. Mēs drīzumā ar tevi sazināsimies.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Vārds <span className="text-primary">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tavs vārds"
                className={`bg-card border-border focus:border-primary transition-colors ${
                  errors.name ? "border-destructive animate-shake" : ""
                }`}
                maxLength={100}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-destructive flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-pasts <span className="text-primary">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tavs@epasts.lv"
                className={`bg-card border-border focus:border-primary transition-colors ${
                  errors.email ? "border-destructive animate-shake" : ""
                }`}
                maxLength={255}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-destructive flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Ziņa <span className="text-primary">*</span>
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tava ziņa..."
                rows={5}
                className={`bg-card border-border focus:border-primary transition-colors resize-none ${
                  errors.message ? "border-destructive animate-shake" : ""
                }`}
                maxLength={1000}
              />
              <div className="flex justify-between mt-1">
                {errors.message ? (
                  <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted-foreground">
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full btn-racing"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sūtu...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Sūtīt ziņu
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
