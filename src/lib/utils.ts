import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from "jspdf";




export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatDate = (dateString?: string | Date | number) => {
  if (!dateString) return "No date";
  try {
    return format(new Date(dateString), "MMM d, yyyy h:mm:ss a");
  } catch {
    return "Invalid date";
  }
};

export const formatTime = (dateString?: string | Date | number) => {
  if (!dateString) return "No time";
  try {
    return format(new Date(dateString), "h:mm:ss a");
  } catch {
    return "Invalid time";
  }
};

export const getMeetingDuration = (start?: string | Date, end?: string | Date) => {
  if (!start || !end) return "N/A";
  try {
  const startDate = formatTime(start);
  const endDate = formatTime(end);

  const convertToSeconds = (time: string) => {
    const [hms, period] = time.split(" ");
    let [h, m, s] = hms.split(":").map(Number);
    
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    return h * 3600 + m * 60 + s;
  };

  const startSec = convertToSeconds(startDate);
  const endSec = convertToSeconds(endDate);

  let diffSec = Math.abs(endSec - startSec);

  if (diffSec < 60) {
    return `${diffSec.toFixed(0)} sec`;
  } else if (diffSec < 3600) {
    return `${(diffSec / 60).toFixed(2)} min`;
  } else {
    return `${(diffSec / 3600).toFixed(2)} hr`;
  }
} catch {
  return "N/A";
}
};
export const getTotalMeetingDuration = (calls?: any[]) => {
  if (!calls) return "N/A";
  const convertToSeconds = (time: string) => {
    const [hms, period] = time.split(" ");
    let [h, m, s] = hms.split(":").map(Number);
    
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    return h * 3600 + m * 60 + s;
  };
  try {
    let totalDuration = 0;
    for (const call of calls) {
      const startSec = convertToSeconds(formatTime(call.startAt));
      const endSec = convertToSeconds(formatTime(call.endedAt));
      let diffSec = Math.abs(endSec - startSec);
      totalDuration += diffSec;
    }
    if (totalDuration < 60) {
      return `${totalDuration.toFixed(0)} sec`;
    } else if (totalDuration < 3600) {
      return `${(totalDuration / 60).toFixed(2)} min`;
    } else {
      return `${(totalDuration / 3600).toFixed(2)} hr`;
    }
  } catch (error) {
    return "N/A";
  }

};

export const formateTranscription = (transcription: any[]) => {
  if (!Array.isArray(transcription) || transcription.length === 0) {
    return [];
  }

  const data: any[] = [];
  let prevSpeaker = transcription[0]?.name || "Unknown";
  let text = "";
  let time = 0;

  transcription.forEach((t: any) => {
    if (t.name !== prevSpeaker) {
      data.push({
        text,
        duration: time < 60 ? `${time.toFixed(2)} sec` :
                time < 3600 ? `${(time / 60).toFixed(2)} min` :
                              `${(time / 3600).toFixed(2)} hr`,
        speakerName: prevSpeaker,
      });

      time = 0;
      text = "";
    }

    time += ((t.stop_ts - t.start_ts) / 1000);
    text += t.text;
    prevSpeaker = t.name;
  });

  data.push({
    text,
    duration: time < 60 ? `${time.toFixed(2)} sec` :
            time < 3600 ? `${(time / 60).toFixed(2)} min` :
                          `${(time / 3600).toFixed(2)} hr`,
    speakerName: prevSpeaker
  });

  return data;
};


export const generateSummary = async (transcription:any) => {
  const fullTranscript = transcription
  .map((t: any) => `${t.speakerName}: ${t.text}`)
  .join(" ");
  const prompt = `
    You are an assistant that summarizes meeting transcripts.

    Return the result strictly in valid JSON format with the following structure:
    {
      "summary": "A short paragraph summarizing the meeting.",
      "keyPoints": ["Point 1", "Point 2",....]
    }

    Transcript:
    ${fullTranscript}
    `;
  const model = new GoogleGenerativeAI(`${process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY}`).getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const content = await model.generateContent(prompt);
  const rawText = content.response.text().trim();
  const cleanText = rawText.replace(/```json|```/g, "").trim();
  const parsedData = JSON.parse(cleanText);
  const callData = {
    aiSummary: parsedData.summary || "",
    keyPoints: parsedData.keyPoints || [],
  };
  return callData;
}


export const thankyouGeneratedMessage= async(command:string)=>{
  const prompt = `
    User input:${command} 
    Write a short and specific LinkedIn thank-you post for meeting participants consider the user input too.

    Tone: professional, appreciative, concise.
    Goal: thank attendees and acknowledge contributions.

    Output format:
    1-2 meaningful sentences
    1 line about collaboration/learning
    Relevant hashtags (3-5 only)
    Add 2 to 5 emojis if needed.`
  ;


  const model = new GoogleGenerativeAI(`${process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY}`).getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const content = await model.generateContent(prompt);
  const rawText = content.response.text().trim();
  return rawText;

}

export const keyPointsGeneratedMessage= async(command:string,transcriptions?:any,recordingLink?:string)=>{
  const prompt = `
Generate concise meeting outcome bullets.

Rules:
- Heading should be "Meeting Outcomes : "
- Also add subheading according the action items, decisions, and next steps.
- Only action items, decisions, and next steps.
- If transcription or input is minimal, return only 2–3 simple general bullets.
- If no real data, provide a brief generic outcome summary.
- If recording link is not available then dont write it.
- Keep it business-focused, no hype, no fluff.
- Use crisp bullet points (•).
- Add 2 relevant hashtags at the end (no more) and in new line also.

User Notes:
${command || "No user notes provided"}

Meeting Transcript:
${transcriptions?.length ? JSON.stringify(transcriptions) : "No transcript available"}

Meeting Recording Link:${recordingLink}

Output must be clean, specific, and professional.
`;


  const model = new GoogleGenerativeAI(`${process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY}`).getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const content = await model.generateContent(prompt);
  const rawText = content.response.text().trim();
  return rawText;
}



export function downloadSummaryPDF(data: any, callData: any) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

 
  const primaryColor: [number, number, number] = [41, 128, 185];
  const accentColor: [number, number, number] = [52, 152, 219];
  const textGray: [number, number, number] = [70, 70, 70];
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 30, "F");

  doc.setFont("Roboto", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Meeting Summary", 105, 18, { align: "center" });

  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleString();
  doc.text(`Generated on: ${currentDate}`, 105, 25, { align: "center" });

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(10, 35, 200, 35);
  doc.setFont("Roboto", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("Call Details : ", 10, 45);

  doc.setFont("Roboto","Lato");
  doc.setFontSize(12);
  doc.setTextColor(...textGray);

  const yStart = 55;
  doc.text(`Title: ${callData.title || "Untitled Meeting"}`, 10, yStart);
  doc.text(`Start At: ${callData.startAt || "N/A"}`, 10, yStart + 8);
  doc.text(`Ended At: ${callData.endedAt || "N/A"}`, 10, yStart + 16);
  doc.text(
    `Duration: ${getMeetingDuration(callData.startAt, callData.endedAt) || "N/A"}`,
    10,
    yStart + 24
  );

  doc.setDrawColor(200, 200, 200);
  doc.line(10, yStart + 32, 200, yStart + 32);

  let yOffset = yStart + 45;
  doc.setFont("Roboto", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("Summary : ", 10, yOffset);

  doc.setFont("Roboto", "italic");
  doc.setFontSize(12);
  doc.setTextColor(...textGray);

  const summaryLines = doc.splitTextToSize(
    data.summary || data.aiSummary || "No summary available.",
    180
  );
  yOffset += 10;
  doc.text(summaryLines, 10, yOffset);

  yOffset += summaryLines.length * 7 + 10;

  doc.setFont("Roboto", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("Key Points : ", 10, yOffset);
  yOffset += 10;

  doc.setFont("Roboto", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...textGray);

  (data.keyPoints || []).forEach((point: string, i: number) => {
    const lines = doc.splitTextToSize(`• ${point}`, 180);
    if (yOffset > 270) {
      doc.addPage();
      yOffset = 20;
    }
    doc.text(lines, 15, yOffset);
    yOffset += lines.length * 7;
  });

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.3);
  doc.line(10, 282, 200, 282);

  doc.setFont("Roboto", "italic");
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text("Generated by Callrio AI", 105, 289, { align: "center" });

  doc.save(`${callData.title || "meeting-summary"}.pdf`);
}



