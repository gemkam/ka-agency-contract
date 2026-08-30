export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        agreementDate, websiteType, agencyRep, agencySignedAt, clientName, clientBusiness, clientAddress,
        clientEmail, clientMobile, clientCNIC, selectedPackage, packageIncludes,
        agreedBudget, agreedInitialFee, agreedMRR, balanceDue, completionDays, contractDuration,
        signatureName, signedAt, companyWebsite, pdfBase64
    } = req.body;

    // Server-side honeypot backstop, same pattern as the inquiry form.
    if (companyWebsite) {
        return res.status(200).json({ success: true, data: { skipped: true } });
    }

    const html = `
        <h2>Signed Contract Record</h2>
        <p><strong>Agreement Date:</strong> ${agreementDate}</p>
        <p><strong>Type of Website:</strong> ${websiteType}</p>
        <hr>
        <h3>K.A. Agency (First Party)</h3>
        <p><strong>Signed by:</strong> ${agencyRep || 'Not signed for this link'}</p>
        ${agencySignedAt ? `<p><strong>Signed at:</strong> ${new Date(agencySignedAt).toLocaleString()}</p>` : ''}
        <hr>
        <h3>Client (Second Party)</h3>
        <p><strong>Name:</strong> ${clientName}</p>
        <p><strong>Business/Company:</strong> ${clientBusiness}</p>
        <p><strong>Address:</strong> ${clientAddress}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Mobile:</strong> ${clientMobile}</p>
        <p><strong>CNIC:</strong> ${clientCNIC}</p>
        <hr>
        <h3>Package &amp; Fees</h3>
        <p><strong>Selected Package:</strong> ${selectedPackage}</p>
        <p><strong>Includes:</strong> ${packageIncludes}</p>
        <p><strong>Total Development Budget:</strong> PKR ${agreedBudget}</p>
        <p><strong>Initial Fee:</strong> PKR ${agreedInitialFee}</p>
        <p><strong>Monthly Maintenance (MRR):</strong> PKR ${agreedMRR}</p>
        <p><strong>Balance Due on Delivery:</strong> ${balanceDue}</p>
        <p><strong>Estimated Completion:</strong> ${completionDays} business days</p>
        <p><strong>Contract Duration:</strong> ${contractDuration}</p>
        <hr>
        <h3>Client Signature</h3>
        <p><strong>Signed by:</strong> ${signatureName}</p>
        <p><strong>Signed at:</strong> ${new Date(signedAt).toLocaleString()}</p>
        <p>The signed contract PDF is attached to this email.</p>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'K.A. Agency Contracts <onboarding@resend.dev>',
                to: ['kzstech000@gmail.com'],
                subject: `Signed Contract: ${clientName}`,
                html,
                attachments: pdfBase64 ? [{
                    filename: `KA_Agency_Contract_${(clientName || 'client').replace(/\s+/g, '_')}.pdf`,
                    content: pdfBase64
                }] : []
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, data });
        } else {
            return res.status(400).json({ error: data });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
