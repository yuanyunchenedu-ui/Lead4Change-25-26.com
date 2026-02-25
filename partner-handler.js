// Partner form functionality
(function() {
  const openBtn = document.getElementById('openPartnerBtn');
  const cancelBtn = document.getElementById('cancelPartnerBtn');
  const formContainer = document.getElementById('partnerFormContainer');
  const partnerForm = document.getElementById('partnerForm');
  const successMessage = document.getElementById('partnerSuccessMessage');

  if (!openBtn || !formContainer || !partnerForm) return;

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

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      const titleContainer = document.querySelector('.feedback-title-container');
      const divider = document.querySelector('.title-divider');

      if (titleContainer) titleContainer.classList.remove('blur');
      if (divider) divider.classList.remove('move-up');

      formContainer.classList.remove('active');
      partnerForm.style.display = 'block';
      successMessage.classList.remove('active');
      openBtn.style.display = 'inline-block';
      partnerForm.reset();
    });
  }

  partnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('partnerName').value,
      email: document.getElementById('partnerEmail').value,
      organization: document.getElementById('partnerOrg').value || 'Not provided',
      message: document.getElementById('partnerMessage').value,
      timestamp: new Date().toISOString()
    };

    const organizationTag = (formData.organization || 'No Organization').trim().slice(0, 80);
    const emailSubject = `Partnership Request: ${organizationTag}`;

    const formattedMessage = `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization}\nMessage: ${formData.message}`;

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
          organization: formData.organization,
          timestamp: formData.timestamp
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit partnership interest');
      }

      partnerForm.style.display = 'none';
      successMessage.classList.add('active');

      setTimeout(() => {
        const titleContainer = document.querySelector('.feedback-title-container');
        const divider = document.querySelector('.title-divider');

        if (titleContainer) titleContainer.classList.remove('blur');
        if (divider) divider.classList.remove('move-up');

        formContainer.classList.remove('active');
        partnerForm.style.display = 'block';
        successMessage.classList.remove('active');
        openBtn.style.display = 'inline-block';
        partnerForm.reset();
      }, 3000);
    } catch (error) {
      window.alert('There was a problem sending your partnership message. Please try again.');
    }
  });
})();
