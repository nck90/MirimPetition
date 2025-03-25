
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/hooks/use-router";

const NotFound = () => {
  const location = useLocation();
  const router = useRouter();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center p-8 rounded-lg glass card-shadow max-w-md">
          <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
          <p className="text-xl mb-8 text-foreground">
            페이지를 찾을 수 없습니다
          </p>
          <p className="text-muted-foreground mb-8">
            요청하신 주소 "{location.pathname}"는 존재하지 않는 페이지입니다.
          </p>
          <Button 
            onClick={() => router.push("/")}
            size="lg"
            className="w-full"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
