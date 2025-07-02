import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { catsApi } from "../api";
import { debounce } from "lodash";

export const useCatSays = () => {
    const globalController = useRef<AbortController | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCat = useCallback(async (value: string) => {
        if (globalController.current) {
            globalController.current.abort();
        }

        const controller = new AbortController();

        globalController.current = controller;

        try {
            setIsLoading(true);

            const { data } = await catsApi.getCat(value, {
                signal: controller.signal,
            });

            setImage(data.url);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const debouncedFetchCat = useMemo(
        () => debounce(fetchCat, 1000),
        [fetchCat]
    );

    const fetch = useCallback(
        (value: string) => {
            if (value.length > 0) {
                debouncedFetchCat(value);
            } else {
                globalController.current?.abort();
                setImage(null);
            }
        },
        [debouncedFetchCat]
    );

    useEffect(() => {
        return () => {
            globalController.current?.abort();
            debouncedFetchCat.cancel();
        };
    }, [debouncedFetchCat]);

    return { image, isLoading, fetch };
};
