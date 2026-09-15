"use client";

import * as React from "react";

interface StrictProviderProps<T> {
    value: T;
    children: React.ReactNode;
}

/**
 * Creates a context whose hook throws instead of silently returning `undefined`
 * when a consumer renders outside its provider.
 *
 * ```ts
 * const [SwitchProvider, useSwitch] = getStrictContext<SwitchState>("Switch");
 * ```
 *
 * Returns `[Provider, useContext]`. `name` is only used in the error message,
 * so pass the component the context belongs to.
 */
export function getStrictContext<T>(
    name: string,
): [React.FC<StrictProviderProps<T>>, () => T] {
    const Context = React.createContext<T | undefined>(undefined);
    Context.displayName = `${name}Context`;

    const Provider: React.FC<StrictProviderProps<T>> = ({ value, children }) => (
        <Context.Provider value={value}>{children}</Context.Provider>
    );
    Provider.displayName = `${name}Provider`;

    const useStrictContext = (): T => {
        const context = React.useContext(Context);
        if (context === undefined) {
            throw new Error(`use${name} must be used within a ${name}Provider`);
        }
        return context;
    };

    return [Provider, useStrictContext];
}