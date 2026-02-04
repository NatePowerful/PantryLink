
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, QrCode, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ScanPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      } else {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Unsupported Browser',
            description: 'Your browser does not support camera access.',
          });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const handleSimulateScan = () => {
    setIsSimulatingScan(true);
    toast({
      title: 'Scan Successful!',
      description: 'Redirecting to item details...',
    });
    
    setTimeout(() => {
      router.push('/inventory/item-001');
    }, 1500);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-6 w-6" /> Scan Food Item
        </CardTitle>
        <CardDescription>
          Position a QR code or barcode in the frame to scan an item. This can be used for receiving donations or for recipients to claim items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden border">
          {hasCameraPermission === null && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Requesting camera access...</p>
            </div>
          )}
          
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please grant camera permissions in your browser to use the scanner.
                </AlertDescription>
              </Alert>
            </div>
          )}

           {hasCameraPermission && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2/3 h-2/3 border-4 border-dashed border-primary/50 rounded-lg" />
            </div>
           )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          For this prototype, you can simulate a successful scan.
        </p>
        <Button
          onClick={handleSimulateScan}
          disabled={!hasCameraPermission || isSimulatingScan}
          className="w-full"
        >
          {isSimulatingScan ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-4 w-4" />
          )}
          {isSimulatingScan ? 'Scanning...' : 'Simulate Scan'}
        </Button>
      </CardFooter>
    </Card>
  );
}
