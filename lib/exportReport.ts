export const exportTransactionReport = async (
    tokenKey: "adminToken" | "token" = "adminToken"
  ): Promise<void> => {
    console.debug("exportTransactionReport called with tokenKey:", tokenKey);

    const token = localStorage.getItem(tokenKey)
    console.debug("Retrieved token from localStorage:", token ? "[REDACTED]" : "None");

    if (!token) {
      console.error("Authentication token missing for key:", tokenKey);
      throw new Error("Authentication token missing")
    }

    const exportUrl =
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` +
      `/api/admin/export/transactions`
    
    console.debug("Export URL generated:", exportUrl);

    // Open a blank tab immediately (avoids popup blockers)
    const newWindow = window.open("", "_blank")
    if (newWindow) {
      console.debug("Blank window/tab opened successfully.");
    } else {
      console.warn("Failed to open new window/tab.");
    }

    console.debug("Starting fetch for export report...");
    const response = await fetch(exportUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log("Fetch response status:", response);

    if (!response.ok) {
      console.error("Failed to export report, status:", response.status);
      throw new Error("Failed to export report")
    }

    const html = await response.text()
    console.debug("Received HTML response from API, length:", html.length);

    if (newWindow) {
      newWindow.document.write(html)
      newWindow.document.close()
      console.debug("Report written to the new window/tab.");
    }
  }