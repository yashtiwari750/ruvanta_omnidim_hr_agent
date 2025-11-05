// yash
/**
 * Main Application Component - AI HR Voice Call Agent
 * 
 * This is the main entry point for the AI-powered HR calling application.
 * It manages the overall state and coordinates between different components.
 * 
 * Features:
 * - Single call functionality
 * - Bulk campaign creation
 * - Call history with pagination
 * - Detailed call view
 * - Animated background
 */

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Upload, List } from 'lucide-react';
import '../styles/animations.css';

// Import components
import AnimatedBackground from './AnimatedBackground';
import SingleCallTab from './SingleCallTab';
import CampaignTab from './CampaignTab';
import CallHistoryList from './CallHistoryList';
import CallDetailsSection from './/CallDetailsSection';
import UserProfileDropdown from './UserProfileDropdown';
import axios from 'axios';

// Import centralized styles
import { styles } from '../styles/appStyles';

export default function VapiVoiceCaller() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Tab and view management
  const [activeTab, setActiveTab] = useState('single-call');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  
  // Single call state
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Campaign state
  const [campaignName, setCampaignName] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  
  // Call history state
  const [callsList, setCallsList] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Loading and status states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCalls, setIsLoadingCalls] = useState(false);
  const [status, setStatus] = useState(null);
  
  // Mouse position for interactive effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // ============================================
  // API CONFIGURATION
  // ============================================

  const API_TOKEN = 'wu2rq5auZwgIuyJdr9KKfITCMyr9XFXGsuq7oDBIZVo';
  const AGENT_ID = 51650; // Replace with your numeric agent ID from OmniDim dashboard
  const FROM_NUMBER_ID = 400; // Replace with your from_number_id from phone number API
  const BACKEND_URL = 'http://localhost:3000/api/omnidim'; // Backend proxy URL

  // ============================================
  // EFFECTS
  // ============================================
  
  /**
   * Track mouse position for interactive effects
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /**
   * Fetch calls list when Call History tab is active
   */
  useEffect(() => {
    if (activeTab === 'call-history') {
      fetchCallsList();
      setCurrentPage(1);
      setViewMode('list');
    }
  }, [activeTab]);

  // ============================================
  // API FUNCTIONS
  // ============================================
  
  /**
   * Fetch list of all calls from OmniDim API via backend proxy
   */
  const fetchCallsList = async () => {
    setIsLoadingCalls(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/call/logs`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        params: {
          page: 1,
          page_size: 30,
          agent_id: AGENT_ID,
          call_status: 'completed'
        }
      });

      console.log('✅ Call logs response:', response.data);
      console.log('✅ Call logs records:', response.data.total_records);
      console.log('📊 Response type:', typeof response.data);
      console.log('🔑 Response keys:', Object.keys(response.data || {}));

      // Extract the array from the response
      let callsArray = [];
      if (Array.isArray(response.data)) {
        console.log('✅ Response is array');
        callsArray = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        console.log('✅ Found results array');
        callsArray = response.data.results;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        console.log('✅ Found data array');
        callsArray = response.data.data;
      } else if (response.data.calls && Array.isArray(response.data.calls)) {
        console.log('✅ Found calls array');
        callsArray = response.data.calls;
      } else {
        console.warn('⚠️ Could not find array in response, checking all properties...');
        // Try to find any array property
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            console.log(`✅ Found array at key: ${key}`);
            callsArray = response.data[key];
            break;
          }
        }
      }

      console.log('📋 Extracted calls array:', callsArray);
      console.log('📏 Array length:', callsArray.length);
      if (callsArray.length > 0) {
        console.log('📝 First call sample:', callsArray[0]);
        console.log('📅 Available date fields:', {
          date: callsArray[0].date,
          created_at: callsArray[0].created_at,
          createdAt: callsArray[0].createdAt,
          start_time: callsArray[0].start_time,
          timestamp: callsArray[0].timestamp,
          updated_at: callsArray[0].updated_at
        });
        console.log('📅 All keys in first call:', Object.keys(callsArray[0]));
      }
      setCallsList(callsArray);
    } catch (error) {
      console.error('❌ Error fetching calls:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      // Always set to empty array on error to prevent crashes
      setCallsList([]);
    } finally {
      setIsLoadingCalls(false);
    }
  };

  /**
   * Handle single call initiation
   */
  const handleSingleCall = async () => {
    if (!phoneNumber.trim()) {
      setStatus({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
      const requestBody = {
        agent_id: AGENT_ID,
        to_number: formattedNumber,
        from_number_id: FROM_NUMBER_ID,
        call_context: {}
      };

      console.log('Dispatching call with payload:', requestBody);

      const response = await fetch(`${BACKEND_URL}/calls/dispatch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('API Response:', { status: response.status, data });

      if (response.ok) {
        // Show brief success notification
        setStatus({ type: 'success', message: `Call connected to ${formattedNumber}` });
        setPhoneNumber('');

        // Add call to list
        if (data.id) {
          setCallsList(prev => [data, ...prev]);
        }

        // Auto-clear success message after 2 seconds and return to ready state
        setTimeout(() => {
          setStatus(null);
          fetchCallsList();
        }, 2000);
      } else {
        const errorMessage = data.message || data.error || 'Failed to initiate call';
        console.error('API Error:', { status: response.status, message: errorMessage, fullResponse: data });
        setStatus({ type: 'error', message: `Error: ${errorMessage}` });
      }
    } catch (error) {
      console.error('Network error:', error);
      setStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle campaign creation with CSV file
   */
  const handleCampaignCreate = async () => {
    if (!campaignName.trim()) {
      setStatus({ type: 'error', message: 'Please enter a campaign name' });
      return;
    }

    if (!csvFile) {
      setStatus({ type: 'error', message: 'Please upload a CSV file' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const customers = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const customer = {};
        headers.forEach((header, index) => {
          customer[header] = values[index];
        });
        return customer;
      });

      // Create calls for each customer
      for (const customer of customers) {
        const phoneNumber = customer.phone || customer.Phone || customer.number;
        if (!phoneNumber) continue;

        const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

        await fetch(`${BACKEND_URL}/calls/dispatch`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            agent_id: AGENT_ID,
            to_number: formattedNumber,
            from_number_id: FROM_NUMBER_ID,
            call_context: {
              ...customer
            }
          })
        });
      }

      // Show brief success notification
      setStatus({ type: 'success', message: `Campaign created: ${customers.length} calls initiated` });
      setCampaignName('');
      setCsvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Auto-clear success message after 2 seconds
      setTimeout(() => {
        setStatus(null);
      }, 2000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Error processing CSV file' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle call item click to view details
   * Fetches complete call details including recording and transcript
   */
  const handleCallClick = async (callId) => {
    setIsLoadingCalls(true);
    try {
      // Fetch complete call details from OmniDim API via backend proxy
      const response = await fetch(`${BACKEND_URL}/call/log/${callId}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      
      if (response.ok) {
        const callDetails = await response.json();
        console.log('📞 hello Call Details Fetched:', callDetails);
        
        console.log('🎙️ Recording URL:', callDetails.artifact?.recordingUrl || callDetails.recordingUrl);
        console.log('📝 Transcript:', callDetails.artifact?.transcript || callDetails.transcript);
        console.log('📊 Analysis:', callDetails.analysis);
        setSelectedCall(callDetails);
        setViewMode('detail');
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch call details:', response.status, errorData);
        setStatus({ type: 'error', message: 'Failed to load call details' });
      }
    } catch (error) {
      console.error('Error fetching call details:', error);
      setStatus({ type: 'error', message: 'Error loading call details' });
    } finally {
      setIsLoadingCalls(false);
    }
  };

  /**
   * Handle back button from call details
   */
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCall(null);
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <AnimatedBackground canvasRef={canvasRef} styles={styles} />
      
      {/* Gradient Overlays */}
      <div style={styles.gradientOverlay} />
      <div style={{
        ...styles.mouseGradient,
        background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(-mousePosition.y + 1) * 50}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
      }} />
      
      {/* Main Content */}
      <div style={styles.content}>
        {/* Header with User Profile */}
        <div style={{...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <h1 style={styles.title}>AI HR Calling Agent</h1>
            <p style={styles.subtitle}>Powered by Vapi AI Voice Technology</p>
          </div>
          <UserProfileDropdown />
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabs}>
          <button
            className="tab-button"
            style={{
              ...styles.tab,
              ...(activeTab === 'single-call' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('single-call')}
          >
            <Phone size={20} />
            Single Call
          </button>
          <button
            className="tab-button"
            style={{
              ...styles.tab,
              ...(activeTab === 'campaign' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('campaign')}
          >
            <Upload size={20} />
            Campaign
          </button>
          <button
            className="tab-button"
            style={{
              ...styles.tab,
              ...(activeTab === 'call-history' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('call-history')}
          >
            <List size={20} />
            Call History
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.card}>
          {activeTab === 'single-call' && (
            <SingleCallTab
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onMakeCall={handleSingleCall}
              isLoading={isLoading}
              status={status}
              styles={styles}
            />
          )}

          {activeTab === 'campaign' && (
            <CampaignTab
              campaignName={campaignName}
              setCampaignName={setCampaignName}
              csvFile={csvFile}
              setCsvFile={setCsvFile}
              onCreateCampaign={handleCampaignCreate}
              isLoading={isLoading}
              status={status}
              styles={styles}
              fileInputRef={fileInputRef}
            />
          )}

          {activeTab === 'call-history' && (
            viewMode === 'list' ? (
              <CallHistoryList
                callsList={callsList}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onCallClick={handleCallClick}
                onRefresh={fetchCallsList}
                isLoading={isLoadingCalls}
                styles={styles}
                call={selectedCall}
              />
            ) : (
              <CallDetailsSection
                call={selectedCall}
                onBack={handleBackToList}
                styles={styles}
              />
            )
          )}
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            0% { 
              opacity: 0;
              transform: translateY(-10px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );

}