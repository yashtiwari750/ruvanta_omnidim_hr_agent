import express from 'express';
import axios from 'axios';

const router = express.Router();

// OmniDim API Configuration
const OMNIDIM_BASE_URL = 'https://backend.omnidim.io/api/v1';

/**
 * Proxy middleware to forward requests to OmniDim API
 * This solves CORS issues by making requests from the backend
 */

// Dispatch a call
router.post('/calls/dispatch', async (req, res) => {
  try {
    const { agent_id, to_number, from_number_id, call_context } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    console.log('Proxying call dispatch:', { agent_id, to_number, from_number_id });

    const response = await axios.post(
      `${OMNIDIM_BASE_URL}/calls/dispatch`,
      {
        agent_id,
        to_number,
        from_number_id,
        call_context: call_context || {}
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error dispatching call:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

// Get call logs
// router.get('/call/logs', async (req, res) => {
//   try {
//     const { page = 1, page_size = 30, agent_id, call_status } = req.query;
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ error: 'No authorization token provided' });
//     }

//     console.log('Proxying call logs request:', { page, page_size, agent_id, call_status });

//     const params = new URLSearchParams({
//       page,
//       page_size
//     });

//     if (agent_id) params.append('agent_id', agent_id);
//     if (call_status) params.append('call_status', call_status);

//     const response = await axios.get(
//       `${OMNIDIM_BASE_URL}/call/logs?${params.toString()}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching call logs:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({
//       error: error.response?.data?.message || error.message,
//       details: error.response?.data
//     });
//   }
// });
// Get call logs
router.get('/call/logs', async (req, res) => {
  try {
    const { page = 1, page_size = 30, agent_id, call_status } = req.query;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    console.log('📞 Proxying call logs request:', { page, page_size, agent_id, call_status });

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(page_size)
    });

    if (agent_id) params.append('agent_id', agent_id);
    if (call_status) params.append('call_status', call_status);

    const fullUrl = `${OMNIDIM_BASE_URL}/calls/logs?${params.toString()}`;
    console.log('🌐 Full URL:', fullUrl);
    console.log('🔑 Token (first 20 chars):', token?.substring(0, 20) + '...');

    const response = await axios.get(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success! Response status:', response.status);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response keys:', Object.keys(response.data || {}));

    // Extract the actual calls array from the response
    let callsData = response.data;

    // If data is nested in call_log_data, extract it
    if (response.data.call_log_data && Array.isArray(response.data.call_log_data)) {
      console.log('📦 Found nested call_log_data array');
      callsData = response.data.call_log_data;
    }

    if (Array.isArray(callsData)) {
      console.log('📊 Array length:', callsData.length);
      if (callsData.length > 0) {
        console.log('📊 First item keys:', Object.keys(callsData[0]));
        console.log('📊 First item sample:', callsData[0]);
      }
    }

    res.status(200).json(callsData);
  } catch (error) {
    console.error('❌ Error fetching call logs');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error data type:', typeof error.response?.data);
    if (typeof error.response?.data === 'string') {
      console.error('Error (first 200 chars):', error.response?.data.substring(0, 200));
    } else {
      console.error('Error data:', error.response?.data);
    }

    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message,
      details: error.response?.data
    });
  }
});


// Get specific call log details
router.get('/call/log/:callLogId', async (req, res) => {
  try {
    const { callLogId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    console.log('📞 Proxying call log details request for ID:', callLogId);

    const fullUrl = `${OMNIDIM_BASE_URL}/calls/logs/${callLogId}`;
    // console.log('🌐 Full URL:', fullUrl);

    const response = await axios.get(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Call details fetched successfully');
    console.log('📊 Response keys:', Object.keys(response.data || {}));

    // Extract the actual call data from the nested structure
    let callData = response.data;

    // If data is nested in call_log_data, extract it
    if (response.data.call_log_data) {
      console.log('📦 Found nested call_log_data');
      callData = response.data.call_log_data;
      console.log('📊 Call data keys:', Object.keys(callData));
    }

    console.log('🎙️ Has recording_url:', !!callData.recording_url);
    console.log('📝 Has transcript:', !!callData.transcript);
    console.log('📊 Has analysis:', !!callData.analysis);
    console.log('📊 Has call_analysis:', !!callData.call_analysis);

    // Return the extracted call data
    res.json(callData);
  } catch (error) {
    console.error('Error fetching call log details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

export default router;

