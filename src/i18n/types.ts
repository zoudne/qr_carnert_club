export interface Messages {
  meta: {
    title: string;
    description: string;
  };
  appName: string;
  nav: {
    manageCarnets: string;
    addCarnet: string;
    welcome: string;
    logout: string;
  };
  language: {
    label: string;
    ar: string;
    en: string;
  };
  login: {
    subtitle: string;
    username: string;
    password: string;
    submit: string;
    submitting: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    addNew: string;
    searchPlaceholder: string;
    loading: string;
  };
  carnet: {
    newTitle: string;
    newSubtitle: string;
    saveAndCreateQr: string;
    saveSuccess: string;
    printQr: string;
    backToList: string;
    addAnother: string;
    detailsTitle: string;
    editData: string;
    editTitle: string;
    saveChanges: string;
    cancelEdit: string;
    backToDetails: string;
    printTitle: string;
    carnetNumberLabel: string;
    carnetBook: string;
    carnetData: string;
    statusTitle: string;
    activeMessage: string;
    expiredMessage: string;
    backToHome: string;
    noCarnets: string;
  };
  form: {
    carnetNumber: string;
    expiryDate: string;
    ownerName: string;
    plateNumber: string;
    vin: string;
    carType: string;
    saving: string;
  };
  table: {
    carnetNumber: string;
    owner: string;
    plateNumber: string;
    vin: string;
    expiryDate: string;
    status: string;
    actions: string;
    view: string;
    printQr: string;
    delete: string;
    confirmDelete: string;
    cancel: string;
  };
  status: {
    active: string;
    expired: string;
  };
  qr: {
    download: string;
    alt: string;
  };
  print: {
    button: string;
    previewHint: string;
    specsTitle: string;
    paperSize: string;
    qrSize: string;
    fromTop: string;
    fromLeft: string;
    fromRight: string;
    pixels: string;
  };
  errors: {
    requiredFields: string;
    duplicateCarnet: string;
    fetchCarnets: string;
    createCarnet: string;
    updateCarnet: string;
    deleteCarnet: string;
    notFound: string;
    loginRequired: string;
    invalidCredentials: string;
    loginFailed: string;
    loginError: string;
    connectionError: string;
    unauthorized: string;
    saveFailed: string;
    updateFailed: string;
  };
}
