
export const TestimonialsWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "They're smart, fast, and trustworthy!",
      author: "Brian Tighe",
      role: "Head Of Technology @ Fool.com",
      avatar: "/images/testimonials/brian-tighe.png",
      rating: 5
    },
    {
      id: 2,
      text: "Doug was incredible to work with and a great communicator. He operated quickly & efficiently, and even proposed ways to improve the feature to exceed our expectations.",
      author: "Allison Nulty",
      role: "Head of Product @ Contra",
      avatar: "/images/testimonials/allison-nulty.png",
      rating: 5,
      highlight: true
    },
    {
      id: 3,
      text: "Doug is a pro. I'd hire him again for any future marketing & technology initiatives.",
      author: "Shelby Stevens",
      role: "Founder, Snacker.ai",
      avatar: "/images/testimonials/shelby-stevens.png",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array(rating).fill(null).map((_, i) => (
      <span key={i} style={{ color: '#ff9500', fontSize: '16px' }}>★</span>
    ));
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      padding: '32px',
      margin: '40px 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#666',
            marginBottom: '8px'
          }}>
            What People Are Saying About Our Clients.
          </h3>
          <div style={{ fontSize: '12px', color: '#999' }}>©2025</div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#fff',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>WithSeismic</h4>
          <div style={{ display: 'flex', gap: '4px' }}>
            {/* Sample user avatars */}
            {['👤', '👥', '👤'].map((emoji, i) => (
              <div key={i} style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                marginLeft: i > 0 ? '-8px' : '0',
                border: '2px solid #fff',
                position: 'relative',
                zIndex: 3 - i
              }}>
                {emoji}
              </div>
            ))}
            <div style={{
              backgroundColor: '#333',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              marginLeft: '4px'
            }}>
              56+
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '12px', color: '#666' }}>
          We've delivered <strong>56+ projects</strong> that help companies generate real results.
        </div>
      </div>

      {/* Testimonial Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: testimonial.highlight ? '2px solid #16a34a' : '1px solid #e0e0e0',
              display: index === currentIndex ? 'block' : window.innerWidth > 768 ? 'block' : 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onClick={() => goToTestimonial(index)}
          >
            {testimonial.highlight && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '20px',
                backgroundColor: '#16a34a',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                10/10!
              </div>
            )}

            <div style={{ marginBottom: '12px' }}>
              {renderStars(testimonial.rating)}
            </div>

            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#333',
              marginBottom: '16px',
              minHeight: '80px'
            }}>
              "{testimonial.text}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                👤
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>
                  {testimonial.author}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {testimonial.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {renderStars(5)}
          <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
            Trusted by clients worldwide
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => window.open('/testimonials', '_blank')}
            style={{
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
          >
            Leave a review
          </button>

          {/* Mobile navigation buttons */}
          {window.innerWidth <= 768 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={prevTestimonial}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ←
              </button>
              <button
                onClick={nextTestimonial}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsWidget;