import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fallback config to ensure form renders even if config.json fails
const fallbackConfig = {
  residential: {
    'Flat/Apartment': {},
    'Independent House / Kothi': {},
    'Independent/Builder Floor': {},
    'Plot': {},
    'Serviced Apartment': {},
    'Farmhouse': {},
    'Other': {},
  },
  commercial: {
    'Office': {},
    'Retail': {},
    'Plot/Land': {},
    'Storage': {},
    'Industry': {},
    'Hospital': {},
    'Other': {},
  },
  step3Fields: [
    {
      name: 'timeline',
      label: 'Timeline',
      type: 'select',
      placeholder: 'Select Timeline',
      options: ['Immediate', 'Within Week', 'Within Month', '1-3 Months', '3-6 Months', '6+ Months'],
      required: true,
    },
    {
      name: 'requirement',
      label: 'Any Specific Requirements',
      type: 'textarea',
      placeholder: 'Specify any specific requirements (max 200 characters)',
      maxLength: 200,
      required: true,
    },
  ],
  leadFields: [
    { name: 'uName', label: 'Name', type: 'text', placeholder: 'Enter lead\'s name', required: true },
    { name: 'mobile', label: 'Phone Number', type: 'text', placeholder: 'Enter 10-digit phone number', keyboardType: 'numeric', maxLength: 10, required: true },
    { name: 'email', label: 'Email', type: 'text', placeholder: 'Enter email (optional)', keyboardType: 'email-address' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select Status',
      options: [
        'New Leads', 'Contacted', 'Qualified', 'Site Visits', 'Negotiation',
        'Booking Confirmed', 'Document Collection', 'Loan Under Process',
        'Finalized / Closed', 'Follow-up', 'Not negotiated', 'Not Interested',
        'Duplicate', 'Invalid Lead',
      ],
      required: true,
    },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Enter address', required: true },
    { name: 'preferred_location', label: 'Preferred Location', type: 'text', placeholder: 'Enter preferred location', required: true },
    { name: 'budget', label: 'Budget', type: 'text', placeholder: 'Enter budget (e.g., 45L or 4500000)', required: true },
    { name: 'max_budget', label: 'Max Budget', type: 'text', placeholder: 'Enter max budget (e.g., 55L or 5500000)', required: true },
    { name: 'leads_type', label: 'Leads Type', type: 'select', placeholder: 'Select Leads Type', options: ['Buyer', 'Seller', 'Renter'], required: true },
    { name: 'description', label: 'Notes', type: 'textarea', placeholder: 'Enter additional notes (optional)', maxLength: 200 },
    { name: 'city', label: 'City', type: 'text', placeholder: 'Enter city', required: true },
    { name: 'state', label: 'State', type: 'text', placeholder: 'Enter state', required: true },
    { name: 'userType', label: 'User Type', type: 'select', placeholder: 'Select User Type', options: ['Individual', 'Agent', 'Builder'], required: true },
    { name: 'Project_Builder', label: 'Project/Builder', type: 'text', placeholder: 'Enter project or builder name (optional)' },
    { name: 'source', label: 'Source', type: 'select', placeholder: 'Select Source', options: ['Website', 'Referral', 'Advertisement', 'Walk-in', 'Other'], required: true },
    { name: 'Profession', label: 'Profession', type: 'text', placeholder: 'Enter profession (optional)' },
    { name: 'deal', label: 'Deal', type: 'select', placeholder: 'Select Deal Status', options: ['Open', 'In Progress', 'Closed'], required: true },
    { name: 'priority', label: 'Priority', type: 'select', placeholder: 'Select Priority', options: ['Hot', 'Cold'], required: true },
  ],
};

// Try importing config.json, use fallback if it fails
let configData;
try {
  configData = require('../../assets/Data/config.json');
  console.log('Config loaded:', JSON.stringify(configData, null, 2));
} catch (error) {
  console.warn('Failed to load config.json, using fallback config:', error);
  configData = fallbackConfig;
}

// Ensure dependencies are installed to avoid RNCMaskedView or LinearGradient errors:
// npm install @react-native-masked-view/masked-view@^0.3.1 react-native-linear-gradient@^2.8.3
// npm install react-native-modal @react-native-picker/picker @react-navigation/native @react-navigation/stack @react-native-async-storage/async-storage
// npx react-native link @react-native-masked-view/masked-view
// For iOS: cd ios && pod install
// For Android: cd android && ./gradlew clean
// Check LeadCard or navigation stack for MaskedView usage.

const AddLeadsModal = ({ onClose }) => {
  const navigation = useNavigation();
  const { leadFields, residential, commercial, step3Fields } = configData;

  const residentialSubTypes = Object.keys(residential || fallbackConfig.residential);
  const commercialSubTypes = Object.keys(commercial || fallbackConfig.commercial);

  const initialFormData = {
    ...leadFields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue || (field.type === 'select' ? (field.options[0] || '') : ''),
    }), {}),
    propertyType: residentialSubTypes.length > 0 ? 'Residential' : 'Commercial',
    propertyType_sub: residentialSubTypes.length > 0 ? residentialSubTypes[0] : (commercialSubTypes[0] || ''),
    requirement: '',
    timeline: step3Fields.find(f => f.name === 'timeline')?.options[0] || 'Immediate',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorModal, setErrorModal] = useState({ isOpen: false, messages: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState('Residential');
  const [activeSubType, setActiveSubType] = useState('');
  const [showBackButton, setShowBackButton] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log('Navigation prop:', navigation);
    console.log('FormData:', JSON.stringify(formData, null, 2));
    console.log('Residential Sub-Types:', residentialSubTypes);
    console.log('Commercial Sub-Types:', commercialSubTypes);
    console.log('Lead Fields:', leadFields.map(f => f.name));
    console.log('Step3 Fields:', step3Fields.map(f => f.name));
    console.log('Current Step:', step);
  }, [step]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.warn('Cannot go back, no navigation history');
      navigation.navigate('LeadStatusOverview');
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorModal({ isOpen: false, messages: [] });
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setFormData((prev) => ({
      ...prev,
      propertyType: value,
      propertyType_sub: value === 'Residential' && residentialSubTypes.length > 0 ? residentialSubTypes[0] : (commercialSubTypes[0] || ''),
    }));
    setActiveSubType('');
    setShowBackButton(false);
  };

  const handleSubTypeSelect = (type) => {
    setActiveSubType(type);
    setFormData((prev) => ({
      ...prev,
      propertyType_sub: type,
    }));
    setShowBackButton(true);
  };

  const handlePropertyBack = () => {
    setActiveSubType('');
    setShowBackButton(false);
    setFormData((prev) => ({
      ...prev,
      propertyType_sub: '',
    }));
  };

  const validateStep = () => {
    const errors = [];
    const fieldsToValidate = {
      1: ['uName', 'mobile', 'email', 'Profession'],
      2: ['propertyType', 'propertyType_sub', 'address', 'preferred_location', 'city', 'state', 'budget', 'max_budget', 'Project_Builder'],
      3: ['leads_type', 'userType', 'source', 'status', 'deal', 'priority', 'timeline', 'requirement', 'description'],
    }[step];

    (step === 4 ? [] : fieldsToValidate).forEach(fieldName => {
      const field = [...leadFields, ...step3Fields, { name: 'propertyType', required: true }, { name: 'propertyType_sub', required: true }].find(f => f.name === fieldName);
      if (!field) return;

      const value = formData[fieldName];
      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors.push(`${field.label || fieldName} is required.`);
      }
      if (fieldName === 'uName' && value && value.trim().length < 2) {
        errors.push('Name must be at least 2 characters.');
      }
      if (fieldName === 'mobile' && value && !/^\d{10}$/.test(value)) {
        errors.push('Valid 10-digit phone number is required.');
      }
      if (fieldName === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push('Invalid email format.');
      }
      if (fieldName === 'address' && value && value.trim().length < 5) {
        errors.push('Address must be at least 5 characters.');
      }
      if ((fieldName === 'budget' || fieldName === 'max_budget') && value && !/^\d+(\.\d+)?[L|C]?$/.test(value)) {
        errors.push(`Valid ${field.label || fieldName} (e.g., 45L or 4500000) is required.`);
      }
      if (field.type === 'select' && value && !field.options?.includes(value)) {
        errors.push(`Invalid ${field.label || fieldName} selected.`);
      }
      if (fieldName === 'propertyType' && !['Residential', 'Commercial'].includes(value)) {
        errors.push('Invalid property type selected.');
      }
      if (
        fieldName === 'propertyType_sub' &&
        ((formData.propertyType === 'Residential' && residentialSubTypes.length > 0 && !residentialSubTypes.includes(value)) ||
         (formData.propertyType === 'Commercial' && commercialSubTypes.length > 0 && !commercialSubTypes.includes(value)))
      ) {
        errors.push('Invalid property sub-type selected.');
      }
    });

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep();
    if (errors.length > 0) {
      setErrorModal({ isOpen: true, messages: errors });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorModal({ isOpen: false, messages: [] });
    if (step === 2 && showBackButton) {
      handlePropertyBack();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting FormData:', JSON.stringify(formData, null, 2));
    setIsLoading(true);
    setErrorModal({ isOpen: false, messages: [] });

    const payload = {
      uName: formData.uName,
      mobile: formData.mobile,
      email: formData.email || '',
      status: formData.status,
      address: formData.address,
      preferred_location: formData.preferred_location,
      budget: formData.budget,
      max_budget: formData.max_budget,
      requirement: formData.requirement,
      leads_type: formData.leads_type,
      description: formData.description || '',
      city: formData.city,
      state: formData.state,
      userType: formData.userType,
      Project_Builder: formData.Project_Builder || '',
      propertyType: formData.propertyType,
      propertyType_sub: formData.propertyType_sub,
      source: formData.source,
      Profession: formData.Profession || '',
      deal: formData.deal,
      timeline: formData.timeline,
      priority: formData.priority,
      rDate: new Date().toISOString(),
    };

    try {
      const userToken = await AsyncStorage.getItem('token');
      if (!userToken) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch('https://bestpropertiesmohali.com/api/Leads/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.multiRemove(['token', 'phone', 'person']);
          navigation.navigate('Login');
          throw new Error('Unauthorized: Please log in again');
        }
        throw new Error(data.message || `API error: ${response.status}`);
      }

      Alert.alert('Success', data.message || 'Lead added successfully!');
      setFormData(initialFormData);
      setStep(1);
      handleClose();
    } catch (error) {
      console.error('API Error:', error);
      setErrorModal({
        isOpen: true,
        messages: [error.message || 'Failed to create lead. Please try again.'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setErrorModal({ isOpen: false, messages: [] });
  };

  const renderField = (field) => {
    const { name, label, type, placeholder, options, keyboardType, maxLength, required } = field;

    console.log(`Rendering field: ${name}`);

    if (type === 'select' && step === 3 && ['status', 'leads_type', 'userType', 'source', 'deal', 'priority'].includes(name)) {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={styles.buttonGrid}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleInputChange(name, option)}
                style={[
                  styles.optionButton,
                  formData[name] === option && styles.selectedOptionButton,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData[name] === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else if (type === 'select') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData[name] || (options && options[0]) || ''}
              onValueChange={(value) => handleInputChange(name, value)}
              style={styles.picker}
              accessibilityLabel={label}
            >
              <Picker.Item label={placeholder || `Select ${label}`} value="" />
              {(options || []).map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>
      );
    } else if (type === 'textarea') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={formData[name] || ''}
            onChangeText={(value) => handleInputChange(name, value)}
            placeholder={placeholder}
            maxLength={maxLength}
            multiline
            numberOfLines={4}
            accessibilityLabel={label}
          />
        </View>
      );
    } else {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Text>
          <TextInput
            style={styles.input}
            value={formData[name] || ''}
            onChangeText={(value) => handleInputChange(name, value)}
            placeholder={placeholder}
            keyboardType={keyboardType || 'default'}
            maxLength={maxLength}
            accessibilityLabel={label}
          />
        </View>
      );
    }
  };

  const renderPreview = () => {
    const allFields = [
      ...leadFields,
      { name: 'propertyType', label: 'Property Type' },
      { name: 'propertyType_sub', label: 'Property Sub-Type' },
      ...step3Fields,
    ];

    return (
      <View style={styles.fieldGrid}>
        <Text style={styles.sectionTitle}>Preview Lead Details</Text>
        {allFields.map(field => (
          <View key={field.name} style={styles.previewField}>
            <Text style={styles.previewLabel}>{field.label}:</Text>
            <Text style={styles.previewValue}>{formData[field.name] || 'Not provided'}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <View style={styles.fieldGrid}>
              <Text style={styles.sectionTitle}>Personal Information (Step 1 of 4)</Text>
              {leadFields.filter(f => ['uName', 'mobile', 'email', 'Profession'].includes(f.name)).map(renderField)}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.backButton}
                accessibilityLabel="Cancel"
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                style={styles.nextButton}
                accessibilityLabel="Next"
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <View style={styles.fieldGrid}>
              <Text style={styles.sectionTitle}>Property Information (Step 2 of 4)</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleOptionChange('Residential')}
                >
                  <View style={[styles.radio, selectedOption === 'Residential' && styles.radioSelected]} />
                  <Text style={styles.radioText}>Residential</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleOptionChange('Commercial')}
                >
                  <View style={[styles.radio, selectedOption === 'Commercial' && styles.radioSelected]} />
                  <Text style={styles.radioText}>Commercial</Text>
                </TouchableOpacity>
              </View>
              {selectedOption && (
                <View style={styles.buttonGrid}>
                  {(selectedOption === 'Residential' ? residentialSubTypes : commercialSubTypes).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => handleSubTypeSelect(type)}
                      style={[
                        styles.propertyButton,
                        activeSubType === type && styles.selectedPropertyButton,
                        activeSubType && activeSubType !== type && styles.hidden,
                      ]}
                    >
                      <Text
                        style={[
                          styles.propertyButtonText,
                          activeSubType === type && styles.selectedPropertyButtonText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {leadFields.filter(f => ['address', 'preferred_location', 'city', 'state', 'budget', 'max_budget', 'Project_Builder'].includes(f.name)).map(renderField)}
            </View>
            <View style={styles.buttonContainer}>
              {(step > 1 || showBackButton) && (
                <TouchableOpacity
                  onPress={handleBack}
                  style={styles.backButton}
                  accessibilityLabel="Back"
                >
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleNext}
                style={styles.nextButton}
                accessibilityLabel="Next"
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 3:
        return (
          <>
            <View style={styles.fieldGrid}>
              <Text style={styles.sectionTitle}>Lead Details (Step 3 of 4)</Text>
              {leadFields.filter(f => ['leads_type', 'userType', 'source', 'status', 'deal', 'priority'].includes(f.name)).map(renderField)}
              {step3Fields.map(renderField)}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                accessibilityLabel="Back"
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                style={styles.nextButton}
                accessibilityLabel="Preview"
              >
                <Text style={styles.buttonText}>Preview</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 4:
        return (
          <>
            {renderPreview()}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                accessibilityLabel="Back"
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.submitButton, isLoading && styles.disabledButton]}
                disabled={isLoading}
                accessibilityLabel="Submit"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isVisible={true}
      onBackdropPress={handleClose}
      style={styles.modalView}
    >
      <View style={styles.modalCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Add New Lead</Text>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            accessibilityLabel="Close modal"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Modal isVisible={errorModal.isOpen} onBackdropPress={closeModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Error</Text>
            {errorModal.messages.map((msg, index) => (
              <Text key={index} style={styles.modalMessage}>
                • {msg}
              </Text>
            ))}
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: { 1: '25%', 2: '50%', 3: '75%', 4: '100%' }[step] }]}
          />
        </View>
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.contentContainer}>
          {leadFields.length === 0 && step3Fields.length === 0 && step !== 4 ? (
            <Text style={styles.errorText}>No form fields available. Check config.json.</Text>
          ) : (
            renderStep()
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    borderRadius: '10',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 16,
    width: '100%',
    minHeight: '95%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#d1d5db',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  formContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fieldGrid: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  propertyButton: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedPropertyButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  propertyButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedPropertyButtonText: {
    color: '#fff',
  },
  hidden: {
    display: 'none',
  },
  optionButton: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedOptionButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#6b7280',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  nextButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#60a5fa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
    marginVertical: 20,
  },
  previewField: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  previewValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
  },
});

export default AddLeadsModal;