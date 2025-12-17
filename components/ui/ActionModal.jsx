'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { Textarea } from './Textarea';
import { Label } from './Label';

export default function ActionModal({ isOpen, onClose, onConfirm, title, description, confirmText = 'Confirm', destructive = false, withInput = false, inputLabel = 'Note' }) {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen) setInputValue('');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md p-4 animate-in fade-in zoom-in duration-200">
                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    {withInput && (
                        <CardContent className="space-y-2">
                            <Label>{inputLabel}</Label>
                            <Textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Add a note..."
                            />
                        </CardContent>
                    )}
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant={destructive ? "destructive" : "default"}
                            onClick={() => {
                                onConfirm(inputValue);
                                onClose();
                            }}
                        >
                            {confirmText}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
