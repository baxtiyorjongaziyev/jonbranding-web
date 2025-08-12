'use client';

import { useState, ChangeEvent } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState('');
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadURL('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setDownloadURL('');
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setDownloadURL(url);
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Rasm muvaffaqiyatli yuklandi.',
      });
    } catch (error) {
      console.error("Error uploading file: ", error);
      toast({
        variant: 'destructive',
        title: 'Xatolik!',
        description: 'Rasmni yuklashda muammo yuzaga keldi.',
      });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (!downloadURL) return;
    navigator.clipboard.writeText(downloadURL);
    toast({
      description: "Havola nusxalandi!",
    });
  }

  return (
    <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Rasm Yuklash</CardTitle>
                    <CardDescription>Rasmlaringizni Firebase Storagega yuklang va havolasini oling.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input type="file" onChange={handleFileChange} accept="image/*" />
                    <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                        {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Yuklash'}
                    </Button>
                    {downloadURL && (
                        <div className="p-4 bg-secondary rounded-lg space-y-3">
                            <p className="text-sm font-medium">Yuklangan rasm havolasi:</p>
                            <div className="flex items-center gap-2">
                                <Input type="text" readOnly value={downloadURL} className="bg-white" />
                                <Button onClick={copyToClipboard} size="icon" variant="ghost">
                                    <Copy className="h-5 w-5"/>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </section>
  );
};

export default ImageUploader;
