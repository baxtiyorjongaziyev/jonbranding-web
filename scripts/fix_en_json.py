import json
import os

def update_nested_dict(d, key, value):
    keys = key.split('.')
    for k in keys[:-1]:
        d = d.setdefault(k, {})
    d[keys[-1]] = value

# My internal translation of these 133 keys
translations = {
  "beforeAfter.ctaDesc": "Let's create a plan to take it to the next level.",
  "beforeAfter.ctaTitle": "Is your brand ready for a change?",
  "blog.subtitle": "News in the world of branding and marketing.",
  "blogPost.author": "Author",
  "blogPost.ctaButton": "Free Consultation",
  "blogPost.ctaDesc": "Get a professional solution for your business.",
  "blogPost.ctaTitle": "Did you like the article?",
  "brandStrategyPage.section2_p1": "Brand strategy is a clear document about who your brand is, why it exists, and how it speaks.",
  "brandStrategyPage.section2_p2_bold": "Positioning: ",
  "brandStrategyPage.section2_p2_text": "Where you stand in the market and why customers should choose you.",
  "brandStrategyPage.section2_p3_bold": "Communication: ",
  "brandStrategyPage.section2_p3_text": "A unified system of your brand's voice, tone, and messages.",
  "brandStrategyPage.section2_p4": "As a result, you will have a brand with a clear direction and one that makes every decision easily.",
  "brandStrategyPage.section2_title": "What does a brand strategy include?",
  "brandbookPage.cta_button": "Create brand guidelines",
  "brandbookPage.cta_description": "A professional brandbook is an investment in the stable future of your business. Let us be your reliable partner in creating this document.",
  "brandbookPage.cta_title": "Ready to organize your brand?",
  "brandbookPage.metadata.description": "A brandbook is the constitution of your brand. We create comprehensive brandbooks that ensure brand integrity and save marketing costs.",
  "brandbookPage.metadata.keywords": "brandbook, guideline, corporate style, brand design, logo usage rules, branding agency",
  "brandbookPage.metadata.title": "Brandbook Development | Jon.Branding Agency",
  "brandbookPage.process_steps": [
    {
      "title": "Brand Platform",
      "description": "Mission, values, brand character, and target audience."
    },
    {
      "title": "Logo and Identity",
      "description": "Rules for using the logo, corporate colors, and fonts."
    },
    {
      "title": "Visual Style",
      "description": "Rules for using photos, illustrations, and graphic elements."
    },
    {
      "title": "Practical Application",
      "description": "Design examples for real carriers (business cards, presentations, social media)."
    }
  ],
  "brandbookPage.process_subtitle": "Our brandbooks include all sections for effective brand management:",
  "brandbookPage.process_title": "What does a brandbook include?",
  "brandbookPage.section1_p1": "A brandbook is the primary tool for brand management. It clearly defines the rules for using visual and conceptual elements — from the logo to the tone of voice.",
  "brandbookPage.section1_p2": "This document helps avoid chaos in marketing, saving time and money when working with designers and marketers.",
  "brandbookPage.section1_title": "Why does every business need a brandbook?",
  "brandbookPage.subtitle": "A brandbook is not just a collection of logos; it is the constitution that ensures your brand's consistency.",
  "brandbookPage.title": "Brandbook Development",
  "brandbookPage.values": [
    {
      "title": "Consistency and Recognition",
      "description": "Ensures your brand looks same and professional across all platforms — from business cards to websites."
    },
    {
      "title": "Resource Saving",
      "description": "No need to repeatedly explain the rules to every new employee or designer, speeding up the workflow."
    },
    {
      "title": "Brand Protection",
      "description": "Protects the identity from incorrect use, preserving your brand's value."
    }
  ],
  "brandbookPage.values_title": "Brandbook solves the following problems:",
  "contactModal.backButton": "Back",
  "contactModal.budget": "Estimated budget?",
  "contactModal.budgetOptions": [
    "No budget yet",
    "Up to $500",
    "$500 - $1,500",
    "$1,500 - $3,000",
    "Above $3,000"
  ],
  "contactModal.companyName": "Company or project name",
  "contactModal.companyNamePlaceholder": "Jon.Branding",
  "contactModal.errorToast.description": "Error occurred while sending request. Please try again.",
  "contactModal.errorToast.title": "Error!",
  "contactModal.formErrors.budget": "Please selects an estimated budget.",
  "contactModal.formErrors.fullName": "Please enter your full name.",
  "contactModal.formErrors.goal": "Please select your goal.",
  "contactModal.formErrors.location": "Please select your location.",
  "contactModal.formErrors.meetingPlace": "You must select a meeting place.",
  "contactModal.formErrors.phone": "Please enter a valid phone number.",
  "contactModal.formErrors.privacyPolicy": "You must accept the policy.",
  "contactModal.fullNamePlaceholder": "Murad Nazarov",
  "contactModal.goal": "What is your goal?",
  "contactModal.goalOptions": [
    {
      "value": "exploring",
      "label": "I don't know what branding is, but I think I need it."
    },
    {
      "value": "has_problem",
      "label": "I have a brand, but it's ineffective, needs analysis."
    },
    {
      "value": "ready_to_start",
      "label": "I understand the power of branding and have a clear goal."
    }
  ],
  "contactModal.leadMagnetToast.description": "Your request has been accepted! We'll first direct you to our free materials.",
  "contactModal.leadMagnetToast.title": "Special Resources!",
  "contactModal.location": "Your location",
  "contactModal.locationOptions": [
    "Tashkent",
    "Fergana",
    "Other"
  ],
  "contactModal.locationPlaceholder": "Select region",
  "contactModal.meetingPlace": "Where shall we meet?",
  "contactModal.meetingPlaceOptions": [
    {
      "value": "our_office",
      "label": "At our office",
      "description": "Dive into the project"
    },
    {
      "value": "neutral",
      "label": "At a neutral location",
      "description": "Free conversation"
    },
    {
      "value": "client_office",
      "label": "At your office",
      "description": "Get to know the business"
    }
  ],
  "contactModal.nextButton": "Next",
  "contactModal.onlineMeetingAlert": "Understood. We'll agree on a convenient time and hold an online meeting.",
  "contactModal.phonePlaceholder": "+998 90 123 45 67",
  "contactModal.privacyPolicyText": "I accept the privacy policy terms and agree to the processing of my personal data.",
  "contactModal.stepTitles.budget": "Budget",
  "contactModal.stepTitles.contact": "Contact Information",
  "contactModal.stepTitles.meeting": "Meeting",
  "contactModal.stepTitles.project": "About Project",
  "contactModal.telegram": "Telegram username (optional)",
  "contactModal.telegramPlaceholder": "@username",
  "contactModal.website": "Website or social media (optional)",
  "contactModal.websitePlaceholder": "https://t.me/jonbranding",
  "corporateStylePage.section2_p1": "It's not just about beauty, but about efficiency, meaning, and control. To make a brand multifaceted while remaining consistent in developing its visual image, a set of graphic elements needs to be created.",
  "corporateStylePage.section2_p2": "Such a set is always selected individually depending on the tasks and capabilities of the business. A minimal set includes the logo, colors, fonts, photo style, style of advertising carriers, and other elements that form a unified image.",
  "corporateStylePage.section2_p3": "When a visual style is built clearly and consistently, it becomes a powerful tool for managing the brand's image and its communication. If all its elements are coordinated, the brand is perceived as professional, reliable, and recognizable.",
  "corporateStylePage.section2_title": "Corporate identity is a system",
  "faq.ctaDesc": "Did you get answers to your questions? Let's discuss your project and take your brand to the next level.",
  "faq.ctaTitle": "No room for doubt!",
  "home.cta1_button": "For my business too",
  "home.cta1_desc": "Take your business to the next level with professional design. We help find the ideal solution for your business.",
  "home.cta1_title": "Your brand could look like this too.",
  "leadMagnet.checklistContent.items": [
    {
      "title": "1. Working without strategy",
      "description": "The biggest mistake is starting design without a plan. Who is your customer? What distinguishes you from competitors? What is your core message? A logo or site that doesn't answer these questions is just a pretty picture.",
      "solution": "Solution: Find answers to 'Who are we?', 'Who are we for?', and 'Why should they choose us?'. This creates a solid foundation for your brand."
    },
    {
      "title": "2. Trying to please everyone",
      "description": "A brand that tries to be for everyone ends up being for no one. Attempting to be ideal for all segments of society makes the brand weak and confusing.",
      "solution": "Solution: Clearly define your target audience. Create an 'ideal customer' portrait and focus all your actions specifically on that category."
    },
    {
      "title": "3. Copying competitors",
      "description": "Observing competitors is important, but copying them is a path to defeat. If your design looks like another popular brand, you'll always be perceived as a 'cheap alternative'.",
      "solution": "Solution: Study the competition to find your own path and uniqueness. Don't be afraid to be different."
    },
    {
      "title": "4. Inconsistency",
      "description": "Having the logo look one way on the site, another on Instagram, and a completely different style on the packaging raises doubt in the buyer and lowers brand recognition.",
      "solution": "Solution: Create a 'brandbook' with rules for using the logo, colors, and fonts, and follow it everywhere."
    },
    {
      "title": "5. Overly complex logo",
      "description": "Logos with too many small details, gradients, and long text are hard to remember. They look very poor in small sizes (favicon or social media avatar).",
      "solution": "Solution: Strive for simplicity and minimalism. The best logo is one that is easily retrieved from memory."
    },
    {
      "title": "6. Difficult to pronounce or unmemorable name",
      "description": "If your customers can't say your brand name or write it correctly, they won't be able to find you or recommend you to others.",
      "solution": "Solution: Choose a name that is simple, resonant, and legally clean (not trademarked)."
    },
    {
      "title": "7. Thinking branding is a one-time thing",
      "description": "Market, customer requirements, and technology are always changing. A brand that doesn't adapt to the times becomes outdated very quickly.",
      "solution": "Solution: Periodically conduct a 'brand audit'. Don't be afraid to update your design (rebranding) if necessary. It's a sign of growth."
    }
  ],
  "leadMagnet.checklistContent.progress_text": "Completed: {checkedCount} / {total}",
  "leadMagnet.checklistContent.result.bad.description": "Your brand has several serious weaknesses. This is a great opportunity for growth! We know how to turn these deficiencies into strengths.",
  "leadMagnet.checklistContent.result.bad.title": "Urgent help needed!",
  "leadMagnet.checklistContent.result.good.description": "The base is good, but it can be strengthened further. keep striving for perfection.",
  "leadMagnet.checklistContent.result.good.title": "You're on the right track!",
  "leadMagnet.checklistContent.result.perfect.description": "Your brand's foundation is solid. Now you need to think about how to use and develop it in practice.",
  "leadMagnet.checklistContent.result.perfect.title": "Excellent result!",
  "mobileCtaBar.final_price": "Final price",
  "pickTwoSelector.tooltip": "Deselect one first",
  "popularPackages.features": [
    "Ideal brand name (checked in 6 languages)",
    "Professional logo (5 concepts)",
    "Full corporate style (colors, fonts)",
    "15+ real mock-up demonstration",
    "Patent audit and consultation",
    "10 branded stickers"
  ],
  "popularPackages.packageDiscount": "(-20% discount!)",
  "popularPackages.packageSubtitle": "The ideal combination for starting a strong brand.",
  "popularPackages.separate": "Separate",
  "popularPackages.upfrontDiscount": "With 100% payment (-28% total!)",
  "process.ctaDesc": "Let's start bringing your ideas to life.",
  "process.ctaTitle": "Ready to discuss the project?",
  "quiz.nextButton": "Next",
  "quiz.questionLabel": "Question {step} / {total}",
  "results.items": [
    {
      "title": "Den Aroma",
      "impact": "+60%",
      "desc": "Increase in average check",
      "label": "Sales growth"
    },
    {
      "title": "Bexruz Market",
      "impact": "+40%",
      "desc": "Increase in customer flow",
      "label": "Visits"
    },
    {
      "title": "Zamin Qurilish",
      "impact": "3 times",
      "desc": "Brand recognition increased",
      "label": "Reputation"
    }
  ],
  "results.subtitle": "We create not just beautiful design, but strategic solutions that contribute to your business development.",
  "results.title": "Our Clients' Results",
  "servicesPage.comparison.ctaDesc": "You don't have to overpay for quality branding. Make the right decision for your business and contact us.",
  "servicesPage.comparison.ctaTitle": "You've seen the difference. Now it's time to choose!",
  "servicesPage.comparison.whyPremiumDesc": "We only compare ourselves with high-level companies that have a strategic approach. Our goal is not just to be cheap, but to provide premium quality at an affordable price. Comparing with agencies that don't match our level in quality and strategy would be wrong for both the client and us.",
  "servicesPage.comparison.whyPremiumTitle": "Why only with premium agencies?",
  "servicesPage.packageBuilder.base_price_label": "Base price",
  "servicesPage.packageBuilder.categories.more_services": "Additional services and terms",
  "servicesPage.packageBuilder.empty_package_desc": "No services selected. Please select appropriate services.",
  "servicesPage.packageBuilder.promo_code_invalid": "Invalid promo code",
  "servicesPage.packageBuilder.promo_code_placeholder": "ENTER CODE",
  "servicesPage.packageBuilder.recommended": "Recommended",
  "servicesPage.packageBuilder.your_package_desc": "Select required services below.",
  "sitemapPage.links.brand_strategy": "Brand strategy",
  "sitemapPage.links.brandbook": "Brandbook",
  "sitemapPage.links.corporate_style": "Corporate identity",
  "sitemapPage.links.faq": "FAQ",
  "sitemapPage.links.home": "Home",
  "sitemapPage.links.logo_design": "Logo design",
  "sitemapPage.links.marketplace_cover": "Seller card design",
  "sitemapPage.links.naming": "Naming",
  "sitemapPage.links.packaging_design": "Packaging design",
  "sitemapPage.links.patent_calculator": "Patent calculator",
  "sitemapPage.links.portfolio": "Portfolio",
  "sitemapPage.links.process": "Workflow",
  "sitemapPage.links.quiz": "Branding test",
  "sitemapPage.links.services_prices": "All services and prices",
  "sitemapPage.subtitle": "Overview of all pages of our site so you can find the necessary information quickly.",
  "sitemapPage.title": "Sitemap",
  "stats.projects": "Successful projects",
  "stats.recommend": "Recommend us",
  "targetAudience.solutionSubtitle": "The right brand strategy eliminates these problems and leads your business to sustainable growth.",
  "testimonials.textReviewsSubtitle": "From our other esteemed clients",
  "testimonials.textReviewsTitle": "Text Reviews",
  "urgencyBlock.line1": "Tomorrow your competitor comes out with a professional brand. The logo is great, the packaging immediately catches the eye.",
  "urgencyBlock.line2": "Customers buy from HIM, not from you.",
  "whyUs.ctaDesc": "Let's analyze your brand for free and identify its strengths and weaknesses. This carries no obligation.",
  "whyUs.ctaTitle": "Did you like our approach?"
}

en_path = r'c:\Users\baxti\.gemini\antigravity\playground\jonbranding-veb-sayti\src\locales\en.json'

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

for k, v in translations.items():
    update_nested_dict(en_data, k, v)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("en.json updated successfully with 133 missing translations.")
