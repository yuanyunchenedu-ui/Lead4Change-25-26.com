// Feedback form functionality
(function() {
  const openBtn = document.getElementById('openFeedbackBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const formContainer = document.getElementById('feedbackFormContainer');
  const feedbackForm = document.getElementById('feedbackForm');
  const successMessage = document.getElementById('successMessage');

  if (!openBtn || !formContainer || !feedbackForm) return;

  // Open feedback form
  openBtn.addEventListener('click', () => {
    const titleContainer = document.querySelector('.feedback-title-container');
    const divider = document.querySelector('.title-divider');
    
    if (titleContainer) titleContainer.classList.add('blur');
    if (divider) divider.classList.add('move-up');
    
    formContainer.classList.add('active');
    openBtn.style.display = 'none';
    setTimeout(() => {
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  });

  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      const titleContainer = document.querySelector('.feedback-title-container');
      const divider = document.querySelector('.title-divider');
      
      if (titleContainer) titleContainer.classList.remove('blur');
      if (divider) divider.classList.remove('move-up');
      
      formContainer.classList.remove('active');
      feedbackForm.classList.remove('hidden');
      successMessage.classList.remove('active');
      openBtn.style.display = 'inline-block';
      feedbackForm.reset();
    });
  }

  // Handle form submission
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value || 'Anonymous',
      email: document.getElementById('email').value || 'Not provided',
      feedback: document.getElementById('feedback').value,
      timestamp: new Date().toISOString()
    };

    const nameTag = (formData.name || 'Anonymous').trim().slice(0, 40);
    const emailSubject = `Website Feedback : [${nameTag}]`;

    const formattedMessage = `Name: ${formData.name}\nEmail: ${formData.email}\nFeedback: ${formData.feedback}`;

    try {
      const response = await fetch('https://formsubmit.co/ajax/lohsleadchange@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: emailSubject,
          _captcha: 'false',
          message: formattedMessage,
          name: formData.name,
          email: formData.email,
          timestamp: formData.timestamp
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      feedbackForm.style.display = 'none';
      successMessage.classList.add('active');

      setTimeout(() => {
        const titleContainer = document.querySelector('.feedback-title-container');
        const divider = document.querySelector('.title-divider');
        
        if (titleContainer) titleContainer.classList.remove('blur');
        if (divider) divider.classList.remove('move-up');
        
        formContainer.classList.remove('active');
        feedbackForm.style.display = 'block';
        successMessage.classList.remove('active');
        openBtn.style.display = 'inline-block';
        feedbackForm.reset();
      }, 3000);
    } catch (error) {
      window.alert('There was a problem sending your feedback. Please try again.');
    }
  });
})();
