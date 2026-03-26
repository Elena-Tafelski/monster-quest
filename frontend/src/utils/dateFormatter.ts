const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Kein Datum";
  
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

export default formatDate;