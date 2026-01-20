import React from 'react';

export const LoadingAnimation = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative h-20 w-20">
                    <div className="absolute h-full w-full animate-spin rounded-full border-4 border-dashed border-primary" />
                    <div className="absolute inset-[15%] h-3/4 w-3/4 animate-spin rounded-full border-4 border-dashed border-accent [animation-direction:reverse]" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    AC Manager
                </h2>
                <p className="text-muted-foreground">Loading your data...</p>
            </div>
        </div>
    );
};
