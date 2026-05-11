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
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 255) {
      newErrors.email = "Email must be less than 255 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message must be less than 1000 characters";
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
              Get in Touch
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">Contact Us</h2>
            <p className="text-muted-foreground mt-4">
              Have questions about our products? We're here to help.
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 animate-slide-up">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-green-500">
                Thank you! Your message has been sent successfully. We'll get back to you soon.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name <span className="text-primary">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
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
                Email <span className="text-primary">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
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
                Message <span className="text-primary">*</span>
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
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
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
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
